import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  ContentType,
  IBodyCreateWhatsAppTemplate, IBodyDeleteWhatsAppTemplate, IBodyRefreshStatus,
  IBodySubmitWhatsAppTemplate,
  WhatsAppTemplate
} from '../models/whatsapp-template';

@Injectable({
  providedIn: 'root',
})
export class WhatsappTemplatesService {
  constructor(private http: HttpClient) {}

  loadTemplates(params = {}) {
    return this.http.get<WhatsAppTemplate[]>(environment.api + `/templates`,  {params});
  }

  createTemplate(body: IBodyCreateWhatsAppTemplate) {
    return this.http.post<WhatsAppTemplate>(environment.api + `/templates/create`,  body);
  }

  submitTemplate(body: IBodySubmitWhatsAppTemplate) {
    return this.http.post<WhatsAppTemplate>(environment.api + `/templates/submit`,  body);
  }

  deleteTemplate(body: IBodyDeleteWhatsAppTemplate) {
    return this.http.delete<WhatsAppTemplate>(environment.api + `/templates/delete`, { body });
  }

  fetchContentTypes() {
    return this.http.get<ContentType[]>(environment.api + `/templates/content-types`);
  }

  refreshStatus(body: IBodyRefreshStatus) {
    return this.http.post<WhatsAppTemplate>(environment.api + `/templates/refresh-status`, body);
  }
}
