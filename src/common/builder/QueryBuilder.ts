export class QueryBuilder<T> {
  private model: any;
  private query: Record<string, any>;

  private where: any = {};
  private orderBy: any = {};
  private skipValue: number = 0;
  private takeValue: number = 10;
  private includeValue: any = undefined;
  private selectValue: any = undefined;

  constructor(model: any, query: Record<string, any>) {
    this.model = model;
    this.query = query;
  }

  search(fields: string[]) {
    const searchTerm = this.query.search;

    if (
      searchTerm &&
      typeof searchTerm === 'string' &&
      searchTerm.trim() !== ''
    ) {
      this.where.OR = fields.map((field) => ({
        [field]: {
          contains: searchTerm.trim(),
          mode: 'insensitive',
        },
      }));
    }

    return this;
  }

  filter() {
    const excludeFields = [
      'search',
      'sortBy',
      'sortOrder',
      'limit',
      'page',
      'skip',
      'take',
      'fields',
    ];

    const filters = { ...this.query };

    excludeFields.forEach((field) => delete filters[field]);

    // Robust cleanup and type handling
    const cleanFilters: any = {};
    Object.keys(filters).forEach((key) => {
      let value = filters[key];

      if (value === undefined || value === null || value === '') {
        return;
      }

      // Explicitly handle common numeric fields (like authorId)
      if (key.toLowerCase().endsWith('id') || key === 'age') {
        const num = Number(value);
        if (!isNaN(num)) value = num;
      }

      // Explicitly handle boolean fields (like published)
      if (value === 'true') value = true;
      if (value === 'false') value = false;

      cleanFilters[key] = value;
    });

    this.where = {
      ...this.where,
      ...cleanFilters,
    };

    return this;
  }

  sort() {
    const sortBy = this.query.sortBy || 'id';
    const sortOrder = (this.query.sortOrder || 'desc').toLowerCase();

    // Ensure sortOrder is either 'asc' or 'desc'
    const validSortOrder = ['asc', 'desc'].includes(sortOrder)
      ? sortOrder
      : 'desc';

    this.orderBy = {
      [sortBy]: validSortOrder,
    };

    return this;
  }

  pagination() {
    const page = Math.max(1, Number(this.query.page) || 1);
    const limit = Math.max(1, Number(this.query.limit) || 10);

    this.skipValue = (page - 1) * limit;
    this.takeValue = limit;

    return this;
  }

  include(include: any) {
    this.includeValue = include;
    return this;
  }

  select(select: any) {
    this.selectValue = select;
    return this;
  }

  async exec(): Promise<T[]> {
    return this.model.findMany({
      where: this.where,
      orderBy: this.orderBy,
      skip: this.skipValue,
      take: this.takeValue,
      include: this.includeValue,
      select: this.selectValue,
    });
  }

  async countTotal() {
    const total = await this.model.count({
      where: this.where,
    });

    const page = Math.max(1, Number(this.query.page) || 1);
    const limit = Math.max(1, Number(this.query.limit) || 10);
    const totalPage = Math.ceil(total / limit);

    return {
      total,
      page,
      limit,
      totalPage,
    };
  }
}
