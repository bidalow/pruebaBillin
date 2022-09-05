export class Importer {
  async import(filePath: string): Promise<any> {
    console.log(
      'remove this line when you use the filePath variable',
      filePath,
    );
    return {
      ok: [],
      ko: [],
    };
  }
}
