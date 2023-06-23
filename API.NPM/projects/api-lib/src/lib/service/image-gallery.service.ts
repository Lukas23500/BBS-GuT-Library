import { Observable, lastValueFrom } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL, ServiceBase } from './base.service';
import { GetImageGalleryDto } from '../dto/image-gallery/get-image-gallery.dto.model copy';
import { ImageGalleryDto } from '../dto/image-gallery/image-gallery.dto.model';
import { UploadImageGalleryDto } from '../dto/image-gallery/upload-image-gallery.dto.model';

@Injectable({
  providedIn: 'root',
})
export class ImageGalleryService extends ServiceBase {
  constructor(
    private http: HttpClient,
    @Inject(API_BASE_URL) baseUrl?: string
  ) {
    super(http, baseUrl);
    this.serviceUrl = `${baseUrl}/api/ImageGallery`;
  }

  private readonly serviceUrl: string;

  public get(id: number): Observable<GetImageGalleryDto> {
    return this.http.get<GetImageGalleryDto>(`${this.serviceUrl}/Get/${id}`, {
      headers: this.generateHeaders(),
    });
  }

  public getAll(): Observable<GetImageGalleryDto[]> {
    return this.http.get<GetImageGalleryDto[]>(`${this.serviceUrl}/GetAll`, {
      headers: this.generateHeaders(),
    });
  }

  public getAllAsync(): Promise<GetImageGalleryDto[]> {
    return lastValueFrom(
      this.http.get<GetImageGalleryDto[]>(`${this.serviceUrl}/GetAll/Async`, {
        headers: this.generateHeaders(),
      })
    );
  }

  public save(imageGallery: ImageGalleryDto): Observable<ImageGalleryDto> {
    return this.http.post<ImageGalleryDto>(`${this.serviceUrl}/Save`, imageGallery, {
      headers: this.generateHeaders(),
    });
  }

  public bulkSave(imageGallery: ImageGalleryDto[]): Observable<ImageGalleryDto[]> {
    return this.http.post<ImageGalleryDto[]>(`${this.serviceUrl}/BulkSave`, imageGallery, {
      headers: this.generateHeaders(),
    }
    );
  }

  public upload(imageGallery: UploadImageGalleryDto): Observable<GetImageGalleryDto> {
    return this.http.post<GetImageGalleryDto>(`${this.serviceUrl}/Upload`, imageGallery, {
      headers: this.generateHeaders(),
    });
  }

  public bulkUpload(imageGallery: UploadImageGalleryDto[]): Observable<GetImageGalleryDto[]> {
    return this.http.post<GetImageGalleryDto[]>(`${this.serviceUrl}/BulkUpload`, imageGallery, {
      headers: this.generateHeaders(),
    });
  }

  public delete(id: number): Observable<ImageGalleryDto> {
    return this.http.delete<ImageGalleryDto>(`${this.serviceUrl}/Delete/${id}`, {
      headers: this.generateHeaders(),
    });
  }

  public bulkDelete(id: number[]): Observable<number> {
    return this.http.delete<number>(`${this.serviceUrl}/BulkDelete/`, {
      body: id,
      headers: this.generateHeaders(),
    });
  }
}
