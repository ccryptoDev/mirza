import { ApiProperty } from '@nestjs/swagger';

export class UploadDocumentResponse {
  @ApiProperty()
  documentId: string;
}
