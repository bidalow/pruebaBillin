import { Importer } from './importer';

describe('importer', () => {
  it('should import successfully the import-success file', async () => {
    const importer = new Importer();
    const result = await importer.import('import-success.csv');

    expect(result.ok.length).toBe(2);
    expect(result.ko.length).toBe(0);

    expect(result.ok[0]).toMatchObject({
      code: 'F001',
      issuedDate: '2021-04-17',
      ownerName: 'John Doe S.L.',
      contactName: 'Jane Roe',
      subtotal: 100.0,
      taxes: 21.0,
      total: 121.0,
      status: 'issued',
    });
    expect(result.ok[1]).toMatchObject({
      code: 'F002',
      issuedDate: '2021-04-18',
      ownerName: 'John Doe S.L.',
      contactName: 'Jane Roe',
      subtotal: 200.0,
      taxes: 42.0,
      total: 242.0,
      status: 'draft',
    });
  });

  it('should import successfully the import-with-errors file', async () => {
    const importer = new Importer();
    const result = await importer.import('import-with-errors.csv');

    expect(result.ok.length).toBe(1);
    expect(result.ko.length).toBe(4);

    expect(result.ko[0]).toEqual(
      expect.objectContaining({
        line: 2,
        errors: [
          {
            property: 'status',
            message: 'invalid',
          },
        ],
      }),
    );
    expect(result.ko[1]).toMatchObject({
      line: 3,
      errors: [
        {
          property: 'ownerName',
          message: 'required',
        },
      ],
    });
    expect(result.ko[2]).toMatchObject({
      line: 4,
      errors: [
        {
          property: 'code',
          message: 'required',
        },
      ],
    });
    expect(result.ko[3]).toMatchObject({
      line: 5,
      errors: [
        {
          property: 'total',
          message: 'invalid',
        },
      ],
    });
  });
});
