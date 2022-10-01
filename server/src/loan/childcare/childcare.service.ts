import { Injectable } from '@nestjs/common';
import { CreateChildcareDto } from './dto/create-childcare.dto';
import { UpdateChildcareDto } from './dto/update-childcare.dto';
import { PaymentManagement } from '../../loan/payments/payment-management/entities/payment-management.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ChildcareService {
  constructor(
    @InjectRepository(PaymentManagement)
    private readonly PaymentManagementRepository: Repository<PaymentManagement>
  ) {}

  async update(loan_id: string, updateChildcareDto: UpdateChildcareDto) {
  //  const response = await this.PaymentManagementRepository.update(
  //     { id: loan_id },
  //     { principalAmount:updateChildcareDto.amount },
  //   );
  //update when you have the correct field
    return `This action updates a #${loan_id} `;
  }
  async get_review_ofert(id: string) {
    let data = [
      {
        id:"1",
        month_payment: "331.55/mo",
        term: "36 months",
        amount_financed: 9000,
        apr: 0,
        total_payments: 17215,
        finance_charge: 2215
      },
      {
        id:"2",
        month_payment: "331.55/mo",
        term: "34 months",
        amount_financed: 10000,
        apr: 0,
        total_payments: 18215,
        finance_charge: 2415
      },
  ];
  const send = data.find((x)=>x.id==id);
    //  const response = await this.PaymentManagementRepository.update(
    //     { id: loan_id },
    //     { principalAmount:updateChildcareDto.amount },
    //   );
    //update when you have the correct field
      return JSON.stringify(send);
    }
 
}
