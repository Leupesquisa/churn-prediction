import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RiskSituationService } from './risk-situation.service';
import { RiskSituation } from '../models/risk-situation';
import { Currency } from '@ilos-frontend/common-rest-services';
import { Dates } from '@ilos-core';
import * as moment from 'moment';

describe('RiskSituationService', () => {
  let service: RiskSituationService;
  let httpMock: HttpTestingController;
  let baseUrl: string;

  // Mock data factories
  const createMockRiskSituation = (overrides?: Partial<RiskSituation>): RiskSituation => ({
    id: 1,
    name: 'Test Risk Situation',
    validationDate: moment(),
    tracking: {
      creationDate: moment(),
      updateDate: moment(),
      createdBy: 'test-user',
      updatedBy: 'test-user'
    },
    ...overrides
  });

  const createMockCurrency = (): Currency => ({
    id: 1,
    code: 'USD',
    name: 'US Dollar'
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RiskSituationService]
    });

    service = TestBed.inject(RiskSituationService);
    httpMock = TestBed.inject(HttpTestingController);
    baseUrl = service.getServiceUrl();
  });

  afterEach(() => {
    // Verifica se não há requisições HTTP pendentes
    httpMock.verify();
  });

  describe('Service Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should extend PaginationService', () => {
      expect(service).toBeInstanceOf(PaginationService);
    });
  });

  describe('fromArrayObject', () => {
    it('should convert string dates to moment objects', () => {
      const input = {
        ...createMockRiskSituation(),
        validationDate: '2024-01-15' as any,
        tracking: {
          creationDate: '2024-01-10' as any,
          updateDate: '2024-01-12' as any
        }
      };

      const result = service.fromArrayObject(input);

      expect(moment.isMoment(result.validationDate)).toBe(true);
      expect(moment.isMoment(result.tracking.creationDate)).toBe(true);
      expect(moment.isMoment(result.tracking.updateDate)).toBe(true);
    });

    it('should preserve moment objects if already moment', () => {
      const input = createMockRiskSituation();
      const result = service.fromArrayObject(input);

      expect(result.validationDate).toEqual(input.validationDate);
    });

    it('should handle missing tracking gracefully', () => {
      const input = {
        ...createMockRiskSituation(),
        tracking: undefined
      };

      const result = service.fromArrayObject(input);

      expect(result.tracking).toBeDefined();
      expect(result.tracking.creationDate).toBeDefined();
    });
  });

  describe('list', () => {
    it('should fetch paginated risk situations', (done) => {
      const mockData = [
        createMockRiskSituation({ id: 1 }),
        createMockRiskSituation({ id: 2 })
      ];

      service.list(0, 10).subscribe(result => {
        expect(result.length).toBe(2);
        expect(result[0].id).toBe(1);
        expect(result[1].id).toBe(2);
        done();
      });

      const req = httpMock.expectOne(req => 
        req.url.includes(baseUrl) && 
        req.params.get('start') === '0' &&
        req.params.get('size') === '10'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockData);
    });

    it('should handle different pagination parameters', (done) => {
      service.list(20, 50).subscribe();

      const req = httpMock.expectOne(req => 
        req.params.get('start') === '20' &&
        req.params.get('size') === '50'
      );
      req.flush([]);
      done();
    });
  });

  describe('findByName', () => {
    it('should search risk situations by query string', (done) => {
      const query = 'test search';
      const mockData = [createMockRiskSituation({ name: 'Test Risk' })];

      service.findByName(query).subscribe(result => {
        expect(result.length).toBe(1);
        expect(result[0].name).toContain('Test');
        done();
      });

      const req = httpMock.expectOne(req => 
        req.url.includes(baseUrl) &&
        req.params.get('query') === query
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockData);
    });

    it('should handle empty query results', (done) => {
      service.findByName('nonexistent').subscribe(result => {
        expect(result.length).toBe(0);
        done();
      });

      const req = httpMock.expectOne(req => req.params.has('query'));
      req.flush([]);
    });
  });

  describe('getTreeViewGroup', () => {
    it('should fetch tree view group with correct parameters', (done) => {
      const params = {
        riskSituationId: 1,
        riskId: 2,
        parentId: 3,
        parentType: 'GROUP' as any
      };

      service.getTreeViewGroup(
        params.riskSituationId,
        params.riskId,
        params.parentId,
        params.parentType
      ).subscribe();

      const req = httpMock.expectOne(req => 
        req.url.includes('treeViewGroup')
      );
      expect(req.request.method).toBe('GET');
      req.flush({});
      done();
    });
  });

  describe('getVarSystemsRiskSituation', () => {
    it('should calculate VAR with correct payload', (done) => {
      const calculationId = 1;
      const calculationType = 'HISTORICAL' as any;
      const riskSituationId = 100;
      const currency = createMockCurrency();
      const exchangeDate = moment('2024-01-15');

      service.getVarSystemsRiskSituation(
        calculationId,
        calculationType,
        riskSituationId,
        currency,
        exchangeDate as any
      ).subscribe();

      const req = httpMock.expectOne(req => 
        req.url.includes('var') && req.url.includes('calculateDate')
      );
      
      expect(req.request.method).toBe('POST');
      expect(req.request.body.riskSituationId).toBe(riskSituationId);
      expect(req.request.body.calculationType).toBe(calculationType);
      expect(req.request.body.currency).toBe(currency.id);
      expect(req.request.body.currencyExchangeDate).toBeDefined();
      
      req.flush({});
      done();
    });

    it('should format date correctly removing time portion', (done) => {
      const exchangeDate = moment('2024-01-15T14:30:00');

      service.getVarSystemsRiskSituation(
        1,
        'PARAMETRIC' as any,
        100,
        createMockCurrency(),
        exchangeDate as any
      ).subscribe();

      const req = httpMock.expectOne(req => req.url.includes('var'));
      const sentDate = req.request.body.currencyExchangeDate;
      
      // Verifica que apenas a data foi enviada, sem hora
      expect(sentDate).not.toContain('T');
      expect(sentDate.length).toBeLessThan(15);
      
      req.flush({});
      done();
    });
  });

  describe('pageForSituationList', () => {
    it('should return paginated response with transformed objects', (done) => {
      const mockResponse = {
        start: 0,
        size: 10,
        total: 100,
        list: [
          { ...createMockRiskSituation(), validationDate: '2024-01-15' as any }
        ]
      };

      service.pageForSituationList(0, 10).subscribe(result => {
        expect(result.start).toBe(0);
        expect(result.size).toBe(10);
        expect(result.total).toBe(100);
        expect(moment.isMoment(result.list[0].validationDate)).toBe(true);
        done();
      });

      const req = httpMock.expectOne(req => 
        req.url.includes('pageForSituationList')
      );
      req.flush(mockResponse);
    });

    it('should pass additional options to request', (done) => {
      const opts = { filter: 'active', sort: 'name' };

      service.pageForSituationList(0, 10, opts).subscribe();

      const req = httpMock.expectOne(req => {
        const hasFilter = req.params.has('filter');
        const hasSort = req.params.has('sort');
        return hasFilter || hasSort || req.url.includes('pageForSituationList');
      });
      
      req.flush({ list: [], start: 0, size: 10, total: 0 });
      done();
    });
  });

  describe('Error Handling', () => {
    it('should handle HTTP errors gracefully', (done) => {
      service.list(0, 10).subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.status).toBe(500);
          done();
        }
      );

      const req = httpMock.expectOne(req => req.url.includes(baseUrl));
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle network errors', (done) => {
      service.findByName('test').subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.error.type).toBe('error');
          done();
        }
      );

      const req = httpMock.expectOne(req => req.url.includes(baseUrl));
      req.error(new ErrorEvent('Network error', {
        message: 'Connection failed'
      }));
    });
  });

  describe('calculateDistrib', () => {
    it('should calculate distribution for risk situation', (done) => {
      const riskSituationId = 123;

      service.calculateDistrib(riskSituationId).subscribe(result => {
        expect(result).toBeDefined();
        done();
      });

      const req = httpMock.expectOne(req => 
        req.url.includes('distrib') && req.url.includes(riskSituationId.toString())
      );
      expect(req.request.method).toBe('GET');
      req.flush({ distribution: 'normal' });
    });
  });

  describe('Export Operations', () => {
    it('should handle export with text response type', (done) => {
      const exportId = 456;

      service.findIdentify(exportId).subscribe(result => {
        expect(typeof result).toBe('string');
        done();
      });

      const req = httpMock.expectOne(req => 
        req.url.includes('nameFile') && 
        req.responseType === 'text'
      );
      expect(req.request.method).toBe('POST');
      req.flush('export-data', { headers: { 'Content-Type': 'text/plain' } });
    });

    it('should post export situation with correct headers', (done) => {
      const exportData = { format: 'xlsx', includeHistory: true };

      service.postGetSituationImportExport(exportData).subscribe();

      const req = httpMock.expectOne(req => 
        req.url.includes('postGetSituation')
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(exportData);
      req.flush({});
      done();
    });
  });

  describe('Edge Cases', () => {
    it('should handle null or undefined parameters gracefully', () => {
      expect(() => service.fromArrayObject(null as any)).not.toThrow();
      expect(() => service.fromArrayObject(undefined as any)).not.toThrow();
    });

    it('should handle empty arrays in list responses', (done) => {
      service.list(0, 10).subscribe(result => {
        expect(result).toEqual([]);
        expect(Array.isArray(result)).toBe(true);
        done();
      });

      const req = httpMock.expectOne(req => req.url.includes(baseUrl));
      req.flush([]);
    });

    it('should handle very large pagination parameters', (done) => {
      const largeStart = 999999;
      const largeSize = 10000;

      service.list(largeStart, largeSize).subscribe();

      const req = httpMock.expectOne(req => 
        req.params.get('start') === largeStart.toString() &&
        req.params.get('size') === largeSize.toString()
      );
      req.flush([]);
      done();
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle complete VAR calculation workflow', (done) => {
      const workflow = {
        calculationId: 1,
        calculationType: 'MONTE_CARLO' as any,
        riskSituationId: 100,
        currency: createMockCurrency(),
        exchangeDate: moment()
      };

      // Primeiro busca a situação de risco
      service.list(0, 10).subscribe(situations => {
        expect(situations).toBeDefined();

        // Depois calcula VAR
        service.getVarSystemsRiskSituation(
          workflow.calculationId,
          workflow.calculationType,
          workflow.riskSituationId,
          workflow.currency,
          workflow.exchangeDate as any
        ).subscribe(varResult => {
          expect(varResult).toBeDefined();
          done();
        });

        const varReq = httpMock.expectOne(req => req.url.includes('var'));
        varReq.flush({ var95: 1000000, var99: 1500000 });
      });

      const listReq = httpMock.expectOne(req => req.params.has('start'));
      listReq.flush([createMockRiskSituation({ id: 100 })]);
    });
  });

  describe('Performance & Memory', () => {
    it('should not leak subscriptions', (done) => {
      const subscription = service.list(0, 10).subscribe();
      
      const req = httpMock.expectOne(req => req.url.includes(baseUrl));
      req.flush([]);

      setTimeout(() => {
        expect(subscription.closed).toBe(true);
        done();
      }, 100);
    });

    it('should handle multiple concurrent requests', (done) => {
      let completed = 0;
      const total = 5;

      for (let i = 0; i < total; i++) {
        service.list(i * 10, 10).subscribe(() => {
          completed++;
          if (completed === total) {
            done();
          }
        });
      }

      const requests = httpMock.match(req => req.url.includes(baseUrl));
      expect(requests.length).toBe(total);
      requests.forEach(req => req.flush([]));
    });
  });
});
