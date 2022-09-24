import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration, CountryCode, ItemPublicTokenExchangeRequest, PlaidApi, PlaidEnvironments, Products } from 'plaid';

@Injectable()
export class PlaidService {
    public plaidConfig: any;
  constructor(
    private readonly configService: ConfigService
  ) {
    this.plaidConfig = {
      basePath: PlaidEnvironments[process.env.PLAID_ENV],
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
          'PLAID-SECRET': process.env.PLAID_SECRET,
        },
      },
    };
  }


  async plaidLinkToken(loan_id) {
    const configuration = new Configuration(this.plaidConfig);

    try {
      const client = new PlaidApi(configuration);
      const response = await client.linkTokenCreate({
        client_name: process.env.PLAID_CLIENT_NAME,
        products: [Products.Auth, Products.Transactions],
        country_codes: [CountryCode.Us],
        language: 'en',
        user: { client_user_id: loan_id },
      });
      return {
        statusCode: 200,
        token: response.data.link_token,
        data: response.data,
      };
    } catch (error) {
      console.log(error);
      return { statusCode: 400, message: error.response.data.error_message };
    }
  }
  async access_token( public_token) {
        try {
      const configuration = new Configuration(this.plaidConfig);
      const client = new PlaidApi(configuration);
      const token = await client.itemPublicTokenExchange({
              public_token: public_token,
            });
      const access_token = token.data.access_token;
      const item_id = token.data.item_id;
        return {"statusCode": 200, "access_token": access_token, "item_id": item_id}
    }catch (error) {
            console.log(error)
            return {"statusCode": 500, "message": [new InternalServerErrorException(error)['response']['name']], "error": "Bad Request"};
          }
  }

  async public_sandbox_token(institution_id){
    try {
      const configuration = new Configuration(this.plaidConfig);
      const client = new PlaidApi(configuration);
      const public_token_response = await client.sandboxPublicTokenCreate({
        client_id: process.env.PLAID_CLIENT_ID,
        secret: process.env.PLAID_SECRET,
        institution_id: institution_id,
        initial_products: [Products.Auth, Products.Transactions],
      });
      return {"statusCode": 200, "public_token": public_token_response.data.public_token}

    } catch (error) {
      console.log(error)
      return {"statusCode": 500, "message": [new InternalServerErrorException(error)['response']['name']], "error": "Bad Request"};
      
    }
  
  }
  async auth_plaid(access_token){
    try {
      const configuration = new Configuration(this.plaidConfig);
      const client = new PlaidApi(configuration);
      const authResponse = await client.authGet({
        access_token: access_token,
      });
      return {"statusCode": 200, "access_token": authResponse.data}

    } catch (error) {
      console.log(error)
      return {"statusCode": 500, "message": [new InternalServerErrorException(error)['response']['name']], "error": "Bad Request"};
      
    }
  
  }

  async identity(access_token){
    try {
      const configuration = new Configuration(this.plaidConfig);
      const client = new PlaidApi(configuration);
      const identityResponse = await client.identityGet({
        access_token: access_token,
      });
      return {"statusCode": 200, "identityResponse": identityResponse.data.accounts}

    } catch (error) {
      console.log(error)
      return {"statusCode": 500, "message": [new InternalServerErrorException(error)['response']['name']], "error": "Bad Request"};
      
    }
  
  }
}
