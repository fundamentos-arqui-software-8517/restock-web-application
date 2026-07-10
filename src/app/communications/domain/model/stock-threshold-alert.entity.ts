export class StockThresholdAlert {
  private constructor(
    public readonly customSupplyId: string,
    public readonly customSupplyName: string,
    public readonly currentStock: number,
    public readonly maxStock: number,
    public readonly status: string,
    public readonly alertId: string,
  ) {}

  static create(props: {
    customSupplyId: string;
    customSupplyName: string;
    currentStock: number;
    maxStock: number;
    status: string;
    alertId: string;
  }): StockThresholdAlert {
    return new StockThresholdAlert(
      props.customSupplyId,
      props.customSupplyName,
      props.currentStock,
      props.maxStock,
      props.status,
      props.alertId,
    );
  }

  get isExcess(): boolean {
    return this.currentStock > this.maxStock;
  }

  get isUnderStock(): boolean {
    return this.currentStock < this.maxStock;
  }
}
