import { Min } from 'class-validator';

export class SelectOfferDto {
  @Min(4)
  term: number;
}
