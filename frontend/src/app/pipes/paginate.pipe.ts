import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paginate',
  standalone: true,
  pure: false  // Importante para que se actualice al cambiar currentPage o pageSize
})
export class PaginatePipe implements PipeTransform {
  transform(array: any[], page: number, pageSize: number): any[] {
    if (!array || array.length === 0) return [];
    const startIndex = (page - 1) * pageSize;
    return array.slice(startIndex, startIndex + pageSize);
  }
}