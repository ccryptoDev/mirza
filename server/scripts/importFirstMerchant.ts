import { Client } from 'pg';

import appConfig from '../src/app.config';

const { databaseUsername, databasePassword, databasePort, databaseName } =
  appConfig();
const client = new Client({
  host: 'localhost',
  port: databasePort,
  user: databaseUsername,
  password: databasePassword,
  database: databaseName,
});
const merchant = JSON.stringify([
  {
    address: '400 Spectrum Center Drive',
    applicationSource: 'admin dashboard',
    city: 'Irvine',
    contactName: 'Mirza',
    email: 'mirza@example.com',
    id: '01d4f47b-ea93-48e9-a306-50dd9bac14f8',
    contractSettingsId: '2b2792b9-350d-40e5-88c5-883aa8ab9da3',
    creditReportSettingsId: '685df3a6-6489-4d5c-9169-c3f5c526c324',
    loanSettingsId: 'f41b9e46-6e11-45fd-b203-6ca87a398d56',
    termsId: '8f1a1498-ceda-4c2e-9cf9-ad9e132f0b9d',
    isDeleted: false,
    phone: '6142099894',
    name: 'Mirza',
    stateCode: 'CA',
    url: 'heymirza',
    zip: '92618',
  },
]);
const contractSettings = JSON.stringify([
  {
    id: '2b2792b9-350d-40e5-88c5-883aa8ab9da3',
    APRReductionRate: 0,
    contractSellAmount: 0,
    contractSellerFee: 0,
    feeReductionRate: 0,
    separateTransactions: false,
    saasFee: false,
  },
]);
const creditReportSettings = JSON.stringify([
  {
    id: '685df3a6-6489-4d5c-9169-c3f5c526c324',
    industryCode: '',
    memberCode: '',
    password: '',
    prefixCode: '',
  },
]);
const account = JSON.stringify([
  {
    id: '23810b1f-d5ff-4e6f-8311-31fa95bc9cbe',
    accountHolder: 'Mirza',
    accountNumber: '123456789012',
    bankName: 'Chase',
    routingNumber: '123456789',
    isPrimaryDisbursementMethod: true,
    merchantId: '01d4f47b-ea93-48e9-a306-50dd9bac14f8',
  },
]);
const card = JSON.stringify([
  {
    id: '0c0d50b2-4523-438d-ae9b-68994b450c95',
    billingAddress: '400 Spectrum Center Drive',
    billingCity: 'Irvine',
    billingName: 'Mirza',
    billingState: 'CA',
    billingZipCode: '92618',
    cardExpiryDate: '09/25',
    cardholderName: 'Mirza',
    cardNumber: '4111 1111 1111 1111',
    securityCode: '123',
    isPrimaryDisbursementMethod: false,
    merchantId: '01d4f47b-ea93-48e9-a306-50dd9bac14f8',
  },
]);
const loanSettings = JSON.stringify([
  {
    id: 'f41b9e46-6e11-45fd-b203-6ca87a398d56',
    autoDisbursementApproval: false,
    delinquencyPeriod: 0,
    lateFee: 0,
    lateFeeGracePeriod: 0,
    NSFFee: 0,
  },
]);
const loanTerms: number[] = [4, 6, 8, 12, 24, 36, 48];
const creditTiers: string[] = ['A', 'B', 'C', 'D'];
const mappedTerms = loanTerms.map((loanTerm: number) => {
  return {
    active: loanTerm === 4 || loanTerm === 12 ? true : false,
    loanTerm,
    tiers: creditTiers.map((creditTier) => {
      return {
        active:
          (loanTerm === 4 || loanTerm === 12) && creditTier === 'A'
            ? true
            : false,
        apr: 0,
        downPayment: 0,
        ficoMax: 850,
        ficoMin: 300,
        ...(loanTerm === 4 && { contractAmount: 500 }),
        ...(loanTerm === 12 && { contractAmount: 2000 }),
        ...(loanTerm !== 4 && loanTerm !== 12 && { contractAmount: 1500 }),
        merchantDiscountRate: 0,
        paymentDiscountRate: 10,
        minAnnualIncome: 0,
        name: creditTier,
      };
    }),
    activeStates: ['all'] as 'all'[],
  };
});
const terms = JSON.stringify([
  {
    id: '8f1a1498-ceda-4c2e-9cf9-ad9e132f0b9d',
    downPaymentType: 'dollarAmount',
    loanSettings: mappedTerms,
  },
]);

(async () => {
  try {
    const contractSettingsQuery = `INSERT INTO merchant_contract_settings (id, "APRReductionRate", "contractSellAmount", "contractSellerFee", "feeReductionRate", "separateTransactions", "saasFee") (SELECT (data->>'id')::uuid, (data->>'APRReductionRate')::int, (data->>'contractSellAmount')::int, (data->>'contractSellerFee')::int, (data->>'feeReductionRate')::int, (data->>'separateTransactions')::boolean, (data->>'saasFee')::boolean FROM (SELECT json_array_elements($1::json) AS data) tmp )`;
    const creditReportSettingsQuery = `INSERT INTO merchant_credit_report_settings (id, "industryCode", "memberCode", password, "prefixCode") (SELECT (data->>'id')::uuid, (data->>'industryCode')::text, (data->>'memberCode')::text, (data->>'password')::text, (data->>'prefixCode')::text FROM (SELECT json_array_elements($1::json) AS data) tmp )`;
    const accountQuery = `INSERT INTO merchant_accounts (id, "accountHolder", "accountNumber", "bankName", "routingNumber", "isPrimaryDisbursementMethod", "merchantId") (SELECT (data->>'id')::uuid, (data->>'accountHolder')::text, (data->>'accountNumber')::text, (data->>'bankName')::text, (data->>'routingNumber')::text, (data->>'isPrimaryDisbursementMethod')::boolean, (data->>'merchantId')::uuid FROM (SELECT json_array_elements($1::json) AS data) tmp )`;
    const cardQuery = `INSERT INTO merchant_cards (id, "billingAddress", "billingCity", "billingName", "billingState", "billingZipCode", "cardExpiryDate", "cardholderName", "cardNumber", "securityCode", "isPrimaryDisbursementMethod", "merchantId") (SELECT (data->>'id')::uuid, (data->>'billingAddress')::text, (data->>'billingCity')::text, (data->>'billingName')::text, (data->>'billingState')::text, (data->>'billingZipCode')::text, (data->>'cardExpiryDate')::text, (data->>'cardholderName')::text, (data->>'cardNumber')::text, (data->>'securityCode')::text, (data->>'isPrimaryDisbursementMethod')::boolean, (data->>'merchantId')::uuid FROM (SELECT json_array_elements($1::json) AS data) tmp )`;
    const loanSettingsQuery = `INSERT INTO merchant_loan_settings (id, "autoDisbursementApproval", "delinquencyPeriod", "lateFee", "lateFeeGracePeriod", "NSFFee") (SELECT (data->>'id')::uuid, (data->>'autoDisbursementApproval')::boolean, (data->>'delinquencyPeriod')::int, (data->>'lateFee')::int, (data->>'lateFeeGracePeriod')::int, (data->>'NSFFee')::int FROM (SELECT json_array_elements($1::json) AS data) tmp )`;
    const termsQuery = `INSERT INTO merchant_terms (id, "downPaymentType", "loanSettings") (SELECT (data->>'id')::uuid, (data->>'downPaymentType')::merchant_terms_downpaymenttype_enum, (data->>'loanSettings')::jsonb FROM (SELECT json_array_elements($1::json) AS data) tmp )`;
    const merchantQuery = `INSERT INTO merchant (address, "applicationSource", city, "contactName", email, id, "contractSettingsId", "creditReportSettingsId", "loanSettingsId", "termsId", "isDeleted", phone, "name", "stateCode", url, zip) (SELECT (data->>'address')::text, (data->>'applicationSource')::merchant_applicationsource_enum, (data->>'city')::text, (data->>'contactName')::text, (data->>'email')::text, (data->>'id')::uuid, (data->>'contractSettingsId')::uuid, (data->>'creditReportSettingsId')::uuid, (data->>'loanSettingsId')::uuid, (data->>'termsId')::uuid, (data->>'isDeleted')::boolean, (data->>'phone')::text, (data->>'name')::text, (data->>'stateCode')::text, (data->>'url')::text, (data->>'zip')::text FROM (SELECT json_array_elements($1::json) AS data) tmp )`;

    await client.connect();
    console.log(`Connected to ${databaseName} database.`);
    console.log(
      'Adding contract settings to merchant_contract_settings table.',
    );
    await client.query(contractSettingsQuery, [contractSettings]);
    console.log(
      'Adding credit report settings to merchant_credit_report_settings table.',
    );
    await client.query(creditReportSettingsQuery, [creditReportSettings]);
    console.log('Adding loan settings to merchant_loan_settings table.');
    await client.query(loanSettingsQuery, [loanSettings]);
    console.log('Adding terms to merchant_terms table.');
    await client.query(termsQuery, [terms]);
    console.log('Adding first merchant to merchant table.');
    await client.query(merchantQuery, [merchant]);
    console.log('Adding account to merchant_accounts table.');
    await client.query(accountQuery, [account]);
    console.log('Adding card to merchant_cards table.');
    await client.query(cardQuery, [card]);

    console.log('Merchant saved');
  } catch (error) {
    console.log('Could not execute script. Error: ', error);
  } finally {
    await client.end();
    console.log('Connection closed.');
    process.exit(0);
  }
})();
