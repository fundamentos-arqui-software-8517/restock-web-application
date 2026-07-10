import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardSectionComponent } from './dashboard-section';
import { AnalyticsStore } from '../../../application/analytics.store';
import { signal } from '@angular/core';
import { Metric } from '../../../domain/model/metric.entity';
import { By } from '@angular/platform-browser';

describe('DashboardSectionComponent', () => {
  let component: DashboardSectionComponent;
  let fixture: ComponentFixture<DashboardSectionComponent>;
  let mockStore: any;

  beforeEach(async () => {
    mockStore = {
      metrics: signal<Metric[]>([]),
      isLoading: signal<boolean>(false),
      selectedRange: signal<'7d' | '30d' | '90d'>('7d'),
      loadMetrics: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [DashboardSectionComponent],
      providers: [{ provide: AnalyticsStore, useValue: mockStore }],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardSectionComponent);
    component = fixture.componentInstance;
  });

  it('should render component without data (empty state)', () => {
    mockStore.metrics.set([]);
    mockStore.isLoading.set(false);
    fixture.detectChanges();

    const emptyState = fixture.debugElement.query(By.css('.empty-state'));
    expect(emptyState).toBeTruthy();
    expect(emptyState.nativeElement.textContent.trim()).toBe('No metrics found.');
  });

  it('should render with mock data and verify cards show values', () => {
    const mockData: Metric[] = [
      {
        id: '1',
        category: 'INVENTORY',
        type: 'SUPPLIES_CREATED',
        lastRefreshedAt: '2026-06-09T10:00:00Z',
        dateRange: { startDate: '2026-06-01', endDate: '2026-06-07' },
        accountId: 'acc1',
        values: [{ resourceId: 'res1', value: 50 }],
      },
      {
        id: '2',
        category: 'WORKERS',
        type: 'WORKERS_HIRED',
        lastRefreshedAt: '2026-06-09T10:00:00Z',
        dateRange: { startDate: '2026-06-01', endDate: '2026-06-07' },
        accountId: 'acc1',
        values: [{ resourceId: 'res2', value: 5 }],
      },
      {
        id: '3',
        category: 'WORKERS',
        type: 'WORKERS_FIRED',
        lastRefreshedAt: '2026-06-09T10:00:00Z',
        dateRange: { startDate: '2026-06-01', endDate: '2026-06-07' },
        accountId: 'acc1',
        values: [{ resourceId: 'res3', value: 2 }],
      },
    ];

    mockStore.metrics.set(mockData);
    fixture.detectChanges();

    const kpiValues = fixture.debugElement.queryAll(By.css('.kpi-value'));
    // INVENTORY sum = 50
    expect(kpiValues[0].nativeElement.textContent.trim()).toBe('50');
    // WORKERS net = 5 - 2 = 3 (with plus sign)
    expect(kpiValues[1].nativeElement.textContent.trim()).toBe('+3');
  });

  it('should display loading skeleton when isLoading is true', () => {
    mockStore.isLoading.set(true);
    fixture.detectChanges();

    const skeletonCards = fixture.debugElement.queryAll(By.css('.skeleton-card'));
    expect(skeletonCards.length).toBe(4);

    const kpiCards = fixture.debugElement.queryAll(By.css('.kpi-card'));
    expect(kpiCards.length).toBe(0);
  });

  it('should call loadMetrics on range change', () => {
    mockStore.isLoading.set(false);
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('.range-selector button'));
    // Click 'Last 30 days'
    buttons[1].triggerEventHandler('click', null);

    expect(mockStore.loadMetrics).toHaveBeenCalledWith('30d');
  });

  it('should filter table by category', () => {
    const mockData: Metric[] = [
      {
        id: '1',
        category: 'INVENTORY',
        type: 'SUPPLIES_CREATED',
        lastRefreshedAt: '2026-06-09T10:00:00Z',
        dateRange: { startDate: '2026-06-01', endDate: '2026-06-07' },
        accountId: 'acc1',
        values: [{ resourceId: 'res1', value: 50 }],
      },
      {
        id: '2',
        category: 'WORKERS',
        type: 'WORKERS_HIRED',
        lastRefreshedAt: '2026-06-09T10:00:00Z',
        dateRange: { startDate: '2026-06-01', endDate: '2026-06-07' },
        accountId: 'acc1',
        values: [{ resourceId: 'res2', value: 5 }],
      },
    ];

    mockStore.metrics.set(mockData);
    fixture.detectChanges();

    // Init state, all rows shown
    let rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(2);

    // Change filter to WORKERS
    const select = fixture.debugElement.query(By.css('#categoryFilter')).nativeElement;
    select.value = 'WORKERS';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(1);
    expect(rows[0].nativeElement.textContent).toContain('WORKERS');
  });
});
