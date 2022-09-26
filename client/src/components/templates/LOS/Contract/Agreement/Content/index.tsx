import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 48px;
  .note {
    display: inline;
    line-height: 1.5;
    margin: 2rem 0;
  }

  & > ul {
    list-style: none;

    & > li > ol {
      padding-left: 1.6rem;
    }
  }

  li {
    margin: 1.2rem 0;
  }

  .list-letters-parentheses {
    counter-reset: list;

    & > li {
      list-style: none;
    }
    & > li:before {
      content: "(" counter(list, lower-alpha) ") ";
      counter-increment: list;
    }
  }

  .list-roman-parentheses {
    counter-reset: list;

    & > li {
      list-style: none;
    }
    & > li:before {
      content: "(" counter(list, lower-roman) ") ";
      counter-increment: list;
    }
  }

  .underline {
    text-decoration: underline;
  }
  .text-center {
    text-align: center;
  }

  .table-wrapper {
    overflow-x: auto;
  }

  table {
    border-collapse: collapse;
    border: none;
    width: 100%;
    min-width: 600px;
    & td {
      padding: 5px 0;
      vertical-align: top;
    }
  }

  .table-even {
    & td {
      width: 50%;
    }
  }

  .heading {
    margin: 2rem 0;
  }

  .ml-16 {
    margin-left: 1.6rem;
  }

  .no-break {
    page-break-inside: avoid;
  }
  .new-page {
    page-break-before: always;
  }

  @media print {
    &.contract-container {
      height: 11in;
      width: 8.5in;
    }

    & ul > li > ol {
      padding-left: 2.2rem;
    }

    body {
      font-size: 10pt;
    }
    .no-break {
      page-break-inside: avoid;
    }
  }

  @page {
    margin: 20mm 10mm;
  }
`;

const Agreement = ({ signature }: { signature: string | null }) => {
  return (
    <Wrapper className="contract-container">
      <ul>
        <li>
          <div className="note">
            This Dealer Agreement is entered into as of the Effective Date, by
            and between Mirza and Dealer.
          </div>
        </li>
        <li>
          <div className="note">
            <b>WHEREAS,</b>
            Dealer offers goods or services to consumers who may be interested
            in obtaining loans to finance their purchases from Dealer.
          </div>
        </li>
        <li>
          <div className="note">
            <b>WHEREAS,</b>
            Mirza has developed a loan marketing, application processing, and
            consumer referral program (“<b>Program</b>,”) which is capable of
            soliciting and prequalifying and qualifying consumers for consumer
            loans from Lenders, presenting consumers the loans for which they
            prequalify or qualify, processing related loan applications, and
            referring consumers to dealers of goods or services.
          </div>
        </li>
        <li>
          <div className="note">
            <b>WHEREAS,</b>
            Dealer desires to promote the availability of loans offered through
            the Program to consumers and encourage the submission of
            applications through the Program for such loans, and to receive
            referrals of consumers seeking goods or services.
          </div>
        </li>
        <li>
          <div className="note">
            <b>NOW, THEREFORE,</b>
            in consideration of the mutual promises contained in this Agreement,
            and for other good and valuable consideration, the receipt and
            sufficiency of which are acknowledged, the Parties agree as follows:
          </div>

          <ol>
            <li>
              <b>Definitions.</b>
              Capitalized terms in this Agreement have the following meanings:
              <ol className="list-letters-parentheses">
                <li>
                  <div className="note">
                    <b>“Advisor”</b>has the meaning provided in
                    <span className="underline">Section 9.</span>
                  </div>
                </li>
                <li>
                  <div className="note">
                    <b>“Agent”</b> means, with respect to a person, any of such
                    person’s employees, officers, directors, owners, Advisors,
                    agents, assigns, affiliates, and representatives.
                  </div>
                </li>
                <li>
                  <div className="note">
                    <b>“Agreement”</b> means this Dealer Agreement by and
                    between the Parties.
                  </div>
                </li>
                <li>
                  <div className="note">
                    <b>“Applicable Law”</b> means any applicable domestic or
                    foreign, federal, state, or local statutes, laws,
                    ordinances, regulations, rules, and any other applicable
                    requirements and guidance of any governmental body, as such
                    may be amended, modified, or supplemented from time to time,
                    and applicable judicial and administrative judgments,
                    orders, stipulations, awards, writs, and injunctions.
                  </div>
                </li>
                <li>
                  <div className="note">
                    <b>“Confidential Information”</b> has the meaning provided
                    in
                    <span className="underline">Section 9.</span>
                  </div>
                </li>
                <li>
                  <div className="note">
                    <b>“Dealer”</b> means the business identified as the Dealer
                    on the signature page of this Agreement.
                  </div>
                </li>
                <li>
                  <div className="note">
                    <b>“Effective Date”</b> means the later of the dates that
                    Mirza and Dealer sign this Agreement, as indicated on the
                    signature page of this Agreement.
                  </div>
                </li>
                <li>
                  <div className="note">
                    <b>“Lender”</b> means any of the various lenders
                    participating in the Program, including Mirza.
                  </div>
                </li>
                <li>
                  <div className="note">
                    <b>“Party”</b> and <b>“Parties</b> respectively mean Mirza
                    and Dealer individually and collectively.
                  </div>
                </li>
                <li>
                  <div className="note">
                    <b>“Program”</b> has the meaning provided in the recitals of
                    this Agreement.
                  </div>
                </li>
                <li>
                  <div className="note">
                    <b>“Marks”</b> means any trademark, trade name, service
                    mark, logo, domain name, or other identifier of source,
                    origin or quality, and registrations and applications for
                    registration of any of the foregoing.
                  </div>
                </li>
                <li>
                  <div className="note">
                    <b>“Term” </b> has the meaning provided in
                    <span className="underline">Section 14.</span>
                  </div>
                </li>
                <li>
                  <div className="note">
                    <b>“Mirza”</b> means Mirza Financial, Inc., a Colorado
                    corporation.
                  </div>
                </li>
              </ol>
            </li>
            <li>
              <div className="note">
                <b>Fees.</b>
                Each Party agrees to pay the other Party the fees in the
                amounts, at the times, and for the activities set forth on
                <span className="underline">Exhibit A.</span>
              </div>
            </li>
            <li>
              <div className="note">
                <b>Mirza Responsibilities.</b>
                <ol className="list-letters-parentheses">
                  <li>
                    <div className="note">
                      <span className="underline">
                        Onboarding and Training.
                      </span>
                      Upon Mirza’s approval of Dealer’s eligibility to
                      participate in Program, Mirza will provide reasonable
                      onboarding assistance and training to Dealer with respect
                      to the Program.
                    </div>
                  </li>
                  <li>
                    <div className="note">
                      <span className="underline">Referrals to Mirza.</span>
                      Mirza will provide functionality for Dealer to direct to
                      the Program those consumers who wish to finance their
                      purchases of goods or services from Dealer.
                    </div>
                  </li>
                  <li>
                    <div className="note">
                      <span className="underline">Dealer Portal.</span>
                      Mirza will provide functionality for Dealer to access the
                      Program through a Dealer-facing portal and, if applicable,
                      to request consumer approval of disbursements of loan
                      proceeds to Dealer from a Lender.
                    </div>
                  </li>
                  <li>
                    <div className="note">
                      <span className="underline">Support.</span>
                      Mirza will provide reasonable support and customer service
                      to Dealer in connection with the Program.
                    </div>
                  </li>
                  <li>
                    <div className="note">
                      <span className="underline">Referrals to Dealer.</span>
                      From time to time, Mirza may refer to Dealer consumers
                      seeking to purchase goods or services.
                    </div>
                  </li>
                </ol>
              </div>
            </li>
            <li>
              <b>Dealer Responsibilities.</b>
              <ol className="list-letters-parentheses">
                <li>
                  <div className="note">
                    <span className="underline">Onboarding and Training.</span>
                    Dealer will provide and verify from time to time all
                    information necessary for Mirza to evaluate Dealer’s
                    eligibility for admission to and ongoing participation in
                    the Program. Dealer will complete any trainings with respect
                    to the Program requested from time to time by Mirza. Upon
                    request by Mirza, Dealer will provide up-to-date
                    descriptions of the goods or services Dealer offers to
                    consumers.
                  </div>
                </li>
                <li>
                  <div className="note">
                    <span className="underline">Authorized Users.</span>
                    Dealer will designate in writing at least one authorized
                    user for the Program. The authorized user will be provided
                    access credentials for the Program. Dealer and its
                    authorized user are responsible for safeguarding any such
                    credentials and are responsible for all interactions with
                    the Program that occur with such credentials.
                  </div>
                </li>
                <li>
                  <div className="note">
                    <span className="underline">Promotion.</span>
                    Dealer will use commercially reasonable efforts to offer,
                    advertise, and promote the Program to all consumers of
                    Dealer’s goods or services;
                    <span className="underline">provided, however,</span>
                    that Dealer will not implement any advertisement or
                    promotion without the prior written consent of Mirza. Mirza
                    will be provided the opportunity to review and approve or
                    disapprove any such advertisement or promotion information
                    or materials in its sole discretion. Dealer will fully
                    incorporate any comments Mirza may have on such
                    advertisement or promotion information or materials and
                    follow any direction Mirza may have relating to such
                    advertisement or promotion information or materials. If
                    Dealer is a member of or participant in a program,
                    association, or other organization (other than the Program)
                    designed or otherwise intended to enhance Dealer’s marketing
                    or sales efforts, Dealer hereby authorizes Mirza at any time
                    during the Term to contact such program, association, or
                    organization and to obtain information about Dealer, its
                    owners, officers, employees, and general business
                    operations.
                  </div>
                </li>
                <li>
                  <div className="note">
                    <span className="underline">Referrals to Mirza.</span>
                    Dealer will offer the Program to all consumers and will
                    direct to the Program those consumers who wish to finance
                    their purchases of goods or services from Dealer. Dealer
                    will not use any adverse selection procedures in offering
                    the Program to consumers or directing consumers to it.
                  </div>
                </li>
                <li>
                  <div className="note">
                    <span className="underline">Guides.</span>
                    In participating in the Program or performing its
                    obligations under this Agreement, Dealer will follow any
                    guides, guidelines, or directions provided by Mirza.
                  </div>
                </li>
                <li>
                  <div className="note">
                    <span className="underline">Consumer Notices.</span>
                    Dealer will obtain any consumer authorizations or consents
                    and prepare and provide to consumers any information,
                    disclosures, and notices related to Dealer’s delivery of
                    goods or services, or to Dealer’s participation in the
                    Program, as required by Applicable Law or as requested by
                    Mirza.
                  </div>
                </li>
                <li>
                  <div className="note">
                    <span className="underline">
                      Written Agreements with Consumers.
                    </span>
                    Dealer will enter into, maintain, and comply with written
                    agreements with its consumers for the delivery of Dealer’s
                    goods or services, which agreements will state the total
                    amount the consumer will pay Dealer for such goods or
                    services, and which comprises the entire agreement between
                    consumer and Dealer relating to such goods or services.
                  </div>
                </li>
                <li>
                  <div className="note">
                    <span className="underline">
                      Consumer Cancellation Rights.
                    </span>
                    Dealer will inform each consumer of any right to cancel the
                    consumer’s agreements with Dealer, explain any such right to
                    the consumer, and provide the consumer a written notice of
                    an such right to cancel without any blanks and in compliance
                    with Applicable Law. If a consumer exercises any such right
                    to cancel an agreement with Dealer, Dealer will notify Mirza
                    immediately.
                  </div>
                </li>
                <li>
                  <div className="note">
                    <span className="underline">Pricing; Quality.</span>
                    Dealer will not impose higher prices, additional fees, or
                    any other less favorable economic terms upon consumers who
                    finance through the Program their purchases of goods or
                    services from Dealer, or provide goods or services of a
                    lesser quality or quantity to consumers who finance through
                    the Program their purchases of goods or services from
                    Dealer, than those Dealer imposes upon or provides to
                    consumers who do not finance through the Program such
                    purchases (including cash purchases). Except upon ten
                    business days’ prior written notice to Mirza, Dealer will
                    not make or undertake any guaranties, warranties, or
                    servicing obligations (other than those arising under
                    Applicable Law) with respect to goods or services financed
                    through the Program. Dealer will honor all guaranties,
                    warranties, and servicing obligations afforded to its
                    consumers by agreement or Applicable Law.
                  </div>
                </li>
                <li>
                  <div className="note">
                    <span className="underline">Complaints.</span>
                    Dealer will resolve all consumer complaints regarding its
                    products and services in a timely and professional manner.
                    Dealer will report to Mirza, in a form determined by Mirza,
                    on any complaints, from consumers or otherwise, relating to
                    any aspect of the Program or to any goods or services
                    financed through the Program.
                  </div>
                </li>
                <li>
                  <div className="note">
                    <span className="underline">
                      Fairness; Nondiscrimination.
                    </span>
                    Dealer will not engage in any practice related Dealer’s
                    offer or delivery of goods or services to consumers or
                    related to the Program or to this Agreement that Mirza
                    considers, in its sole discretion, to be unfair, deceptive,
                    abusive, inappropriate, misleading, false, or fraudulent.
                    Dealer will not engage in any form of illegal prescreening
                    or other form of discrimination prohibited under the Equal
                    Credit Opportunity Act and its implementing regulations; or
                    in any practice related Dealer’s offer or delivery of goods
                    or services to consumers, or related to the Program or to
                    this Agreement, that Mirza considers to be discriminatory
                    against any consumer based on the race, color, religion,
                    national origin, sex (including sexual orientation and
                    gender discrimination), marital status, age (provided that
                    the applicant has the capacity to enter into a binding
                    contract), the fact that all or part of the consumer’s
                    income derives from any public assistance program, the fact
                    that the consumer is a domestic violence victim, or the fact
                    that the consumer has in good faith exercised any right
                    under the Consumer Credit Protection Act or any state law
                    upon which an exemption has been granted by the Consumer
                    Financial Protection Bureau, or any other prohibited basis
                    under Applicable Law.
                  </div>
                </li>
                <li>
                  <div className="note">
                    <span className="underline">Insurance.</span>
                    Dealer represents and warrants that it has and will maintain
                    insurance in such amounts and against such risks as are
                    reasonably necessary to protect its business and agrees to
                    provide proof of such insurance to Mirza upon request.
                  </div>
                </li>
                <li>
                  <div className="note">
                    <span className="underline">
                      Information Privacy; Security.
                    </span>
                    Dealer will: (i) ensure that its facilities and all
                    information related to the Program are secured and
                    maintained in a commercially reasonable manner; and (ii)
                    comply with all Applicable Laws in connection with the
                    collection, protection, storage, management, retention, and
                    use of consumer information.
                  </div>
                </li>
                <li>
                  <div className="note">
                    <span className="underline">Audit.</span>
                    Dealer will provide Mirza full access to its books, records,
                    accounts, systems, personnel, and facilities so that Mirza
                    and its designees may conduct audits of such books, records,
                    accounts, systems, personnel, and facilities to assess
                    compliance with the terms of this Agreement and Applicable
                    Law. Dealer will make available knowledgeable personnel to
                    assist Mirza in conducting such audits. Any audit will be
                    conducted during regular business hours at Dealer’s offices
                    and in such a manner as not to interfere unreasonably with
                    Dealer’s normal business activities. Dealer will also
                    cooperate fully with any audit by a governmental body having
                    jurisdiction over Mirza or a Lender who has financed through
                    the Program a purchase of goods or services from Dealer.
                    Each Party will bear its own audit costs.
                  </div>
                </li>
                <li>
                  <div className="note">
                    <span className="underline">Fraud.</span>
                    Dealer will not engage in and will take commercially
                    reasonable measures to prevent fraud by any person in
                    connection with the Program and this Agreement.
                  </div>
                </li>
              </ol>
            </li>
            <li>
              <div className="note">
                <b>Requests for Disbursements.</b> If the proceeds of a
                consumer’s loan financed through the Program are to be disbursed
                by the Lender to Dealer, then:
              </div>
              <ol className="list-letters-parentheses">
                <li>
                  <div className="note">
                    re to be disbursed by the Lender to Dealer, then: Dealer
                    will use the Program’s Dealer-facing portal to request the
                    relevant consumer’s approval of Dealer’s requested
                    disbursement.
                  </div>
                </li>
                <li>
                  <div className="note">
                    Dealer will use the Program’s Dealer-facing portal to
                    provide any certifications, documents, and information
                    requested by Mirza in support of Dealer’s requested
                    disbursement.
                  </div>
                </li>
                <li>
                  <div className="note">
                    As of any date that Dealer requests the consumer’s approval
                    of such a disbursement, and as of any date that such
                    proceeds are disbursed to Dealer, Dealer represents and
                    warrants:
                  </div>
                  <ol className="list-roman-parentheses">
                    <li>
                      <div className="note">
                        The relevant consumer and Dealer’s relevant
                        representative were each at least 18 years of age and
                        had the authority and legal capacity necessary to enter
                        into the agreement between the relevant consumer and
                        Dealer at the time such consumer and Dealer entered into
                        their agreement, and any such consumer’s right to cancel
                        its agreement with Dealer has expired.
                      </div>
                    </li>
                    <li>
                      <div className="note">
                        Dealer has accurately and completely documented and
                        reported to Mirza the amount, date, and payment method
                        of any down payments or other payments paid by or on
                        behalf of the relevant consumer with respect to Dealer’s
                        goods or services being financed or expected to be
                        financed through the Program.
                      </div>
                    </li>
                    <li>
                      <div className="note">
                        Dealer has actually and timely delivered its goods or
                        services (or the appropriate portion of such goods or
                        services in the case of progress payments) to the
                        relevant consumer, as agreed between the consumer and
                        Dealer.
                      </div>
                    </li>
                    <li>
                      <div className="note">
                        The relevant consumer is satisfied with the quantity,
                        quality, and timing of Dealer’s goods or services (or
                        the appropriate portion of such goods or services in the
                        case of progress payments) that have been delivered to
                        the consumer.
                      </div>
                    </li>
                    <li>
                      <div className="note">
                        The goods and services purchased by the relevant
                        consumer from Dealer have been carefully and properly
                        installed, inspected, and adjusted according to
                        applicable manufacturer or factory recommendations, and
                        all necessary licenses, permits, approvals, consents,
                        and other authorizations required by any governmental
                        body have been obtained.
                      </div>
                    </li>
                    <li>
                      <div className="note">
                        Dealer has delivered its goods or services (or the
                        appropriate portion of such goods or services in the
                        case of progress payments) to the relevant consumer
                        pursuant to a final, bona fide sale transaction and not
                        on a trial or other contingent basis.
                      </div>
                    </li>
                    <li>
                      <div className="note">
                        There has been no rebate, refund, discount, dispute,
                        kickback, fraud, setoff, or counterclaim, and there is
                        no expectation of, promise for, or basis for a rebate,
                        refund, discount, dispute, kickback, fraud, setoff, or
                        counterclaim, between the consumer and Dealer.
                      </div>
                    </li>
                    <li>
                      <div className="note">
                        Dealer has not breached any of its representations,
                        warranties, or covenants in this Agreement.
                      </div>
                    </li>
                  </ol>
                </li>
                <li>
                  <div className="note">
                    Dealer will deliver written consent, consistent with
                    Applicable Law or as requested by Mirza, for the execution
                    by Mirza, or the Lender who has financed through the Program
                    a purchase of goods or services from Dealer, ACH credit and
                    debit transactions to Dealer’s bank account, which must be a
                    commercial demand account at a federally insured depository
                    institution titled in Dealer’s legal name, and Dealer will
                    ensure that Mirza and such
                  </div>
                </li>
              </ol>
            </li>
            <li>
              <div className="note">
                <b>Representations and Warranties.</b>
                Dealer makes the following representations and warranties on a
                continuing basis beginning on the Effective Date:
              </div>
              <ol className="list-letters-parentheses">
                <li>
                  <div className="note">
                    <span className="underline">Legal Status.</span>
                    Dealer is duly organized, validly existing, and in good
                    standing under the laws of its organizational jurisdiction,
                    duly qualified to do business in each jurisdiction where it
                    conducts business, and has the full power and authority to
                    carry on its business.
                  </div>
                </li>
                <li>
                  <div className="note">
                    <span className="underline">
                      Authority to Enter into Agreement.
                    </span>
                    Dealer has full power and authority to enter into, deliver,
                    and perform all its obligations under this Agreement, and it
                    has been duly authorized to do so by any necessary
                    organizational action. There are no laws, organizational
                    instruments, contracts, or any other circumstances that
                    would conflict with or prevent Dealer from entering into or
                    performing its obligations under this Agreement. The
                    individual executing this Agreement on Dealer’s behalf is at
                    least 18 years of age and has the authority and legal
                    capacity necessary to bind Dealer.
                  </div>
                </li>
                <li>
                  <div className="note">
                    <span className="underline">Validity.</span>
                    Following execution and delivery, this Agreement constitutes
                    the valid and binding obligation of Dealer, enforceable
                    against it in accordance with its terms.
                  </div>
                </li>
                <li>
                  <div className="note">
                    <span className="underline">Business Purpose.</span>
                    Dealer’s entry into this Agreement and participation in the
                    Program will be solely for lawful business purposes and not
                    for any personal, family, or household purpose.
                  </div>
                </li>
                <li>
                  <div className="note">
                    <span className="underline">Accurate Information.</span>
                    All information that Dealer has provided Mirza is accurate
                    and complete, and Dealer’s authorized representative will
                    certify the accuracy and completeness of such information
                    upon reasonable request.
                  </div>
                </li>
                <li>
                  <div className="note">
                    <span className="underline">
                      Licenses; Compliance With Law.
                    </span>
                    Dealer maintains and is in compliance with all licenses,
                    permits, approvals, consents, and other authorizations
                    required by any governmental body to conduct its business.
                    Dealer is in compliance with all Applicable Law. Dealer is
                    not a target of any economic sanctions issued by any
                    governmental body.
                  </div>
                </li>
                <li>
                  <div className="note">
                    <span className="underline">Legal Proceedings.</span>
                    There is no action, suit, claim, inquiry, investigation, or
                    legal, administrative, or arbitration proceeding pending or
                    currently threatened against Dealer, whether at law, in
                    equity, or before any governmental body.
                  </div>
                </li>
              </ol>
            </li>
            <li>
              <div className="note">
                <b>Program Use.</b>
                Dealer will not:
                <ol className="list-letters-parentheses">
                  <li>
                    <div className="note">
                      Post, transmit, or otherwise make available:
                    </div>
                    <ol className="list-roman-parentheses">
                      <li>
                        <div className="note">
                          Any material that would give rise to criminal or civil
                          liability; that encourages conduct that constitutes a
                          criminal offense; or that encourages or provides
                          instructional information about illegal activities or
                          activities such as “hacking,” “cracking,” or
                          “phreaking.”
                        </div>
                      </li>
                      <li>
                        <div className="note">
                          Any virus, worm, Trojan horse, Easter egg, time bomb,
                          spyware, or other computer code, file, or program that
                          is harmful or invasive or may or is intended to damage
                          or hijack the operation of, or to monitor the use of,
                          any hardware, software, or equipment.
                        </div>
                      </li>
                      <li>
                        <div className="note">
                          Any unsolicited or unauthorized advertising,
                          promotional material, “junk mail,” “spam,” “chain
                          letter,” “pyramid scheme,” or investment opportunity,
                          or any other form of solicitation.
                        </div>
                      </li>
                      <li>
                        <div className="note">
                          Any non-public information about any person without
                          the proper authorization to do so.
                        </div>
                      </li>
                    </ol>
                  </li>
                  <li>
                    <div className="note">
                      Use the Program for any fraudulent or unlawful purpose.
                    </div>
                  </li>
                  <li>
                    <div className="note">
                      Use the Program to violate the legal rights of others,
                      including others’ privacy rights or rights of publicity,
                      or harvest or collect personally identifiable information
                      about other users.
                    </div>
                  </li>
                  <li>
                    <div className="note">Impersonate any person.</div>
                  </li>
                  <li>
                    <div className="note">
                      Interfere with or disrupt the operation of the Program or
                      the servers or networks used to make the Program
                      available.
                    </div>
                  </li>
                  <li>
                    <div className="note">
                      Restrict or inhibit any other person from using the
                      Program.
                    </div>
                  </li>
                  <li>
                    <div className="note">
                      Reproduce, duplicate, copy, sell, resell, or otherwise
                      exploit for any commercial purpose, any portion of, use
                      of, or access to the Program.
                    </div>
                  </li>
                  <li>
                    <div className="note">
                      Modify, adapt, translate, reverse engineer, decompile, or
                      disassemble any portion of Mirza’s website, applications,
                      or Program.
                    </div>
                  </li>
                  <li>
                    <div className="note">
                      Use any robot, spider, site search/retrieval application
                      or other manual or automatic device to retrieve, index,
                      “scrape,” “data mine,” or in any way gather Mirza’s
                      content or reproduce or circumvent Mirza’s navigational
                      structure or presentation.
                    </div>
                  </li>
                  <li>
                    <div className="note">
                      Do anything in connection with Mirza’s website,
                      applications, or Program not expressly authorized by this
                      Agreement.
                    </div>
                  </li>
                </ol>
              </div>
            </li>
            <li>
              <div className="note">
                <b>Data Ownership; Licenses.</b>
              </div>
              <ol className="list-letters-parentheses">
                <li>
                  <div className="note">
                    <span className="underline">Consumer Data.</span>
                    All consumer data provided to Mirza in connection with the
                    Program is owned exclusively by Mirza.
                  </div>
                </li>
                <li>
                  <div className="note">
                    <span className="underline">License by Mirza.</span>
                    Mirza grants to Dealer a limited, non-exclusive,
                    non-sublicensable, royalty-free, non-transferable, and
                    revocable license to display, reproduce, and use Mirza’s
                    Marks identified to Dealer in writing by Mirza solely in
                    connection with the Program activities undertaken pursuant
                    to this Agreement. Dealer acknowledges Mirza’s sole and
                    exclusive ownership of Mirza’s Marks and agrees not to take
                    any action inconsistent with such ownership. Upon
                    termination of this Agreement, the license granted to Dealer
                    by Mirza will immediately terminate, and Dealer will
                    immediately cease and desist all use, display, and
                    reproduction of Mirza’s Marks and return or destroy any
                    materials in its possessions bearing Mirza’s Marks.
                  </div>
                </li>
                <li>
                  <div className="note">
                    <span className="underline">License by Dealer.</span>
                    Dealer grants to Mirza a limited, non-exclusive,
                    non-sublicensable, royalty-free, non-transferable, and
                    revocable license to display, reproduce, and use Dealer’s
                    Marks identified to Mirza in writing by Dealer solely in
                    connection with the Program activities undertaken pursuant
                    to this Agreement. Mirza acknowledges Dealer’s sole and
                    exclusive ownership of Dealer’s Marks and agrees not to take
                    any action inconsistent with such ownership. Upon
                    termination of this Agreement, the license granted to Mirza
                    by Dealer will immediately terminate, and Dealer will
                    immediately cease and desist all use, display, and
                    reproduction of Dealer’s Marks and return or destroy any
                    materials in its possessions bearing Dealer’s Marks.
                  </div>
                </li>
                <li>
                  <div className="note">
                    <span className="underline">Ownership</span>
                    Except as provided in this Agreement, all right, title and
                    interest in and to the Program and all related intellectual
                    property rights will remain in Mirza and, except for the
                    express limited rights granted in this Agreement, no right,
                    title or interest in or to any of Mirza’s intellectual
                    property, is granted, transferred or otherwise provided by
                    this Agreement.
                  </div>
                </li>
              </ol>
            </li>
            <li>
              <div className="note">
                <b>Confidentiality.</b>
                Dealer agrees that the provisions of this Agreement, any guides,
                guidelines, and other related documentation and information
                provided to Dealer by Mirza or related to this Agreement or the
                Program (collectively, <b>“Confidential Information”</b>) are
                Mirza’s proprietary and confidential information. Unless
                disclosure is required by Applicable Law or court order, Dealer
                will not disclose Confidential Information to any person other
                than Dealer’s attorneys, accountants, or employees who need to
                know such information for the purpose of advising Dealer (each,
                an
                <b>“Advisor”</b>), provided such Advisor uses such information
                solely for the purpose of advising Dealer and first agrees in
                writing to be bound by the terms of this Section 9. Dealer
                agrees that its obligations in this Section 9 are necessary and
                reasonable in order to protect Mirza’s business, and Dealer
                expressly agrees that monetary damages would be inadequate to
                compensate the Mirza for any breach of this Section 9.
                Accordingly, Dealer agrees and acknowledges that any such
                violation or threatened violation would cause irreparable injury
                to Mirza and that, in addition to any other remedies that may be
                available, in law, in equity or otherwise, Mirza will be
                entitled to injunctive relief against the threatened breach of
                this Section 9 or the continuation of any such breach, without
                the necessity of proving actual damages.
              </div>
            </li>
            <li>
              <div className="note">
                <b>Disclaimer of Warranties.</b>
                THE PROGRAM AND ANY REFERRALS TO DEALER ARE PROVIDED “AS IS” AND
                “AS AVAILABLE” WITHOUT ANY WARRANTIES OF ANY KIND, INCLUDING
                IMPLIED WARRANTIES. Mirza DISCLAIMS ALL WARRANTIES WITH RESPECT
                TO THE PROGRAM AND SUCH REFERRALS TO THE FULLEST EXTENT POSSIBLE
                UNDER APPLICABLE LAW, INCLUDING THE WARRANTIES OF
                MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, QUIET
                ENJOYMENT, QUALITY, ACCURACY, NONINFRINGEMENT, TITLE, AND ANY
                WARRANTY ARISING OUT OF COURSE OF DEALING, USAGE, OR TRADE.
              </div>
            </li>
            <li>
              <div className="note">
                <b>LIMITATION OF LIABILITY.</b>
                DEALER AGREES TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW
                THAT NEITHER Mirza NOR ANY LENDER (AND ANY OF THEIR RESPECTIVE
                AGENTS) WILL BE LIABLE TO DEALER OR ANY AGENTS OF DEALER FOR ANY
                CONSEQUENTIAL, SPECIAL, INCIDENTAL, INDIRECT, EXEMPLARY, OR
                PUNITIVE DAMAGES (INCLUDING LOS OF PROFITS, BUSINESS, OR DATA)
                OF ANY KIND UNDER ANY CONTRACT, NEGLIGENCE, STRICT LIABILITY, OR
                OTHER THEORY; AND IN NO EVENT WILL ANY REMAINING LIABILITY
                EXCEED TWELVE (12) TIMES THE AVERAGE FEES PAID TO DEALER EACH
                MONTH UNDER THIS AGREEMENT.
              </div>
            </li>
            <li>
              <div className="note">
                <b>Indemnification.</b>
                In addition to any other rights and remedies Mirza and any
                Lender have under this Agreement or Applicable Law, which rights
                and remedies will be cumulative, Dealer agrees to indemnify and
                hold harmless Mirza and any Lender (and any of their respective
                Agents) from and against any claims, causes of action,
                liabilities, losses, damages, settlements, penalties, fines,
                forfeitures, fees, costs, and expenses (including reasonable
                attorneys’ fees and costs), arising out of or relating to: (a)
                noncompliance with or violation of any Applicable Law by Dealer
                or any of its Agents; (b) Dealer’s breach of any of its
                representations, warranties, or covenants in this Agreement; (c)
                the gross negligence or willful misconduct of Dealer or any of
                its Agents; (d) any infringement by Dealer or any of its Agents
                of any person’s intellectual property rights; (e) any
                guaranties, warranties, servicing obligations, or other
                obligations owed by Dealer to, or Dealer’s breach of any
                agreement with, any person; (f) any goods or services offered or
                provided by Dealer to any person; (g) the operations or business
                of Dealer or any of its Agents; (h) any security breach of, or
                unauthorized access to, Dealer or any of its Agents; (i) any
                unauthorized disclosure of Confidential Information; (j) the
                acts or omissions of Dealer or any of its Agents; (k) any fraud
                in connection with the Program; (l) any claims or defenses in
                respect of any transaction financed through the Program which
                could be asserted against Dealer.
              </div>
            </li>
            <li>
              <div className="note">
                <b>Set Off.</b>
                Mirza or any Lender may set off any amounts Dealer owes to Mirza
                or such Lender against any fees, disbursements of consumer loan
                proceeds, or other amounts owed to Dealer.
              </div>
            </li>
            <li>
              <div className="note">
                <b>Deposit Account. </b>
              </div>
              <ol className="list-letters-parentheses">
                <li>
                  <div className="note">
                    <span className="undeline">Deposit Account.</span>
                    Dealer will identify a deposit account acceptable to Mirza
                    (the “Deposit Account”) for use in connection with the
                    Program. Dealer represents, warrants, and covenants that (i)
                    the Deposit Account is a business demand deposit account
                    titled in Dealer’s name and held by a U.S. financial
                    institution, (ii) Dealer owns and is authorized to use and
                    grant access to the Deposit Account to make any payment due
                    under this Agreement, (iii) the Deposit Account is used
                    solely for lawful business purposes, (iv) the Deposit
                    Account is not a personal account and is not used for any
                    personal, family, or household purpose, (v) Dealer will
                    maintain the Deposit Account in good standing with its
                    financial institution, (vi) Dealer will maintain within the
                    Deposit Account a balance sufficient to make any payment
                    when due under this Agreement, (vii) Dealer will not,
                    without Mirza’s prior written consent, terminate or change
                    the Deposit Account or any related authorizations or access
                    credentials provided to Mirza.
                  </div>
                </li>
                <li>
                  <div className="note">
                    <span className="undeline">
                      Automatic Payment Authorization
                    </span>
                    Dealer irrevocably authorizes Mirza to access, review,
                    credit, debit, and otherwise withdraw directly from the
                    Deposit Account any outstanding amounts due under this
                    Agreement, including after the termination of this
                    Agreement. Dealer agrees that depending upon the balance
                    maintained in the Deposit Account, these debit transactions
                    might affect up to all funds held in the Deposit Account or
                    accessible through any overdraft or similar features offered
                    by Dealer’s financial institution. Dealer agrees that if a
                    debit transaction is rejected for any reason, Mirza may
                    attempt to debit the Deposit Account again until the
                    transaction is completed, and that Mirza is not responsible
                    for any fees charged by Dealer’s financial institution in
                    connection with this Agreement, including fees related to
                    debit transactions, overdrafts, other payments, or returned
                    payments. Dealer may not revoke or cancel this payment
                    authorization until all amounts Dealer owes to Mirza or any
                    Lender under this Agreement have been paid in full. This
                    payment authorization does not impair or relieve Dealer’s
                    obligation to pay any amount owed to Mirza or any Lender
                    under this Agreement.
                  </div>
                </li>
                <li>
                  <div className="note">
                    <span className="undeline">Processing Trial.</span>
                    Before Mirza or any Lender delivers any funds to Dealer,
                    Mirza may conduct a processing trial to confirm its access
                    to the Deposit Account and its ability to debit or otherwise
                    withdraw funds from it.
                  </div>
                </li>
              </ol>
            </li>
            <li>
              <div className="note">
                <b>Term; Termination.</b>
                This Agreement continues from the Effective Date until
                terminated by a Party, and it may be terminated by any Party
                upon written notice to the other Party, with or without cause.
              </div>
            </li>
            <li>
              <div className="note">
                <b>Survival.</b>
                The obligations in Sections 2 (for any unpaid amounts due), 7
                through 13, 15, and 16 will survive any termination of this
                Agreement.
              </div>
            </li>
            <li>
              <div className="note">
                <b>Miscellaneous.</b>
              </div>
              <ol className="list-letters-parentheses">
                <li>
                  <div className="note">
                    <span className="underline">Publicity.</span>
                    Neither Party will issue any press releases nor make any
                    public statements regarding this Agreement or the
                    relationship between the Parties without the prior written
                    consent of the other Party. Notwithstanding the forgoing,
                    Mirza may without Dealer’s prior written consent, identify
                    Dealer, by name or by Mark, as a participant in the Program
                    on Mirza’s customer lists, investor pitches, web pages, and
                    other promotional or marketing materials.
                  </div>
                </li>
                <li>
                  <div className="note">
                    <span className="underline">Attorneys’ Fees.</span>
                    In any action or proceeding to enforce rights under this
                    Agreement, the prevailing Party will be entitled to recover
                    costs and attorneys’ fees.
                  </div>
                </li>
                <li>
                  <div className="note">
                    <span className="underline">Governing Law; Venue</span>
                    This Agreement will be governed by the law of the State of
                    Colorado (without regard to conflicts of law provisions).
                    Each Party exclusively and irrevocably submits to the
                    exclusive jurisdiction of any state or federal court in the
                    City of Denver, Colorado for purposes of all legal
                    proceedings arising out of or relating to this Agreement.
                    Each Party irrevocably waives, to the fullest extent
                    permitted by law, any objection that it may now or hereafter
                    have to the laying of venue of any such proceedings brought
                    in such a court and any claim that any such proceedings
                    brought in such a court have been brought in an inconvenient
                    forum. Each Party consents to process being served in any
                    suit, action or proceeding with respect to this Agreement by
                    the mailing of a copy thereof by registered or certified
                    mail, postage prepaid, return receipt requested, to its
                    respective address specified at the time for notices under
                    this Agreement.
                  </div>
                </li>
                <li>
                  <div className="note">
                    <span className="underline">JURY TRIAL WAIVER.</span>
                    THE PARTIES WAIVE THE RIGHT TO A TRIAL BY JURY IN ANY LEGAL
                    PROCEEDING ARISING OUT OF OR RELATING TO THIS AGREEMENT,
                    EXCEPT TO THE EXTENT SUCH WAIVER IS PROHIBITED BY LAW. EACH
                    PARTY MAKES THIS WAIVER KNOWINGLY, WILLINGLY, VOLUNTARILY,
                    AND WITHOUT DURESS, AND ONLY AFTER BEING PROVIDED WITH THE
                    OPPORTUNITY TO CONSIDER THE RAMIFICATIONS WITH ITS LEGAL
                    COUNSEL.
                  </div>
                </li>
                <li>
                  <div className="note">
                    <span className="underline">CLASS ACTION WAIVER. </span>
                    THE PARTIES WAIVE ANY RIGHT TO ASSERT ANY CLAIMS AGAINST THE
                    OTHER PARTY AS A REPRESENTATIVE OR MEMBER OF ANY CLASS OR IN
                    ANY OTHER REPRESENTATIVE ACTION, EXCEPT TO THE EXTENT SUCH
                    WAIVER IS PROHIBITED BY LAW. TO THE EXTENT THIS PROVISION
                    ALLOWS EITHER PARTY TO PROCEED WITH A CLASS OR
                    REPRESENTATIVE ACTION AGAINST THE OTHER, THE PARTIES AGREE
                    THAT THE PREVAILING PARTY WILL NOT BE ENTITLED TO RECOVER
                    LEGAL FEES AND DISBURSEMENTS OR ANY OF THE COSTS ASSOCIATED
                    WITH PURSUING THE CLASS OR REPRESENTATIVE ACTION
                    (NOTWITHSTANDING ANY OTHER PROVISION IN THIS AGREEMENT).
                    EACH PARTY MAKES THESE WAIVERS KNOWINGLY, WILLINGLY,
                    VOLUNTARILY, AND WITHOUT DURESS, AND ONLY AFTER BEING
                    PROVIDED WITH THE OPPORTUNITY TO CONSIDER THE RAMIFICATIONS
                    WITH ITS LEGAL COUNSEL.
                  </div>
                </li>
                <li>
                  <div className="note">
                    <span className="underline">Assignment</span>
                    This Agreement is binding upon, and inures to the benefit
                    of, the Parties and their respective successors and
                    permitted assigns; provided, that Dealer may not assign,
                    transfer, convey, appoint an agent, license, sub-license, or
                    resell its rights or obligations under this Agreement, or
                    any interest, payment, or rights under this Agreement,
                    without the prior written consent of Mirza. Any assignment
                    made by a Dealer without the prior written consent of Mirza
                    is and will be void and of no effect.
                  </div>
                </li>
                <li>
                  <div className="note">
                    <span className="underline">
                      Entire Agreement; Rules of Interpretation.
                    </span>
                    This Agreement, including all exhibits, contains the
                    Parties’ entire understanding on the subject matter of this
                    Agreement, and supersedes all prior discussions,
                    representations, and agreements. No rule of strict
                    construction may be applied against any Party on the basis
                    that it was the drafter or creator of this Agreement. No
                    course of dealing or individual waiver by either Party will
                    be deemed to alter the terms of the Agreement. Each Party
                    acknowledges that it received (or had access to) its own
                    legal counsel.
                  </div>
                </li>
                <li>
                  <div className="note">
                    <span className="underline">Severability and Waiver.</span>
                    If any portion of the Agreement is stricken as invalid, the
                    remaining portions will remain in full force and effect.
                    Failure of either Party to exercise any of its rights in a
                    particular instance will not be construed as a waiver of
                    those rights or any other rights for any purpose.
                  </div>
                </li>
                <li>
                  <div className="note">
                    <span className="underline">
                      Interpretation and Headings.
                    </span>
                    The section headings in this Agreement are solely for
                    convenience and may not be used to interpret this Agreement.
                    The words “include” or “including” mean without limitation
                    by reason of enumeration.
                  </div>
                </li>
                <li>
                  <div className="note">
                    <span className="underline">Amendment.</span>
                    This Agreement may be amended only by a writing signed by
                    both Parties.
                  </div>
                </li>
                <li>
                  <div className="note">
                    <span className="underline">Counterparts.</span>
                    This Agreement may be executed in counterparts, each of
                    which will be deemed an original, but all of which together
                    will constitute one and the same instrument. A signed copy
                    of this Agreement by hand or electronic signature delivered
                    by email or other means of electronic transmission will be
                    deemed to have the same legal effect as delivery of an
                    original signed copy of this Agreement.
                  </div>
                </li>
                <li>
                  <div className="note">
                    <span className="underline">
                      Relationship of Parties; No Third-Party Beneficiaries.
                    </span>
                    Nothing in this Agreement will constitute or create a
                    partnership, joint venture, agency, or other relationship
                    between the Parties. To the extent either Party undertakes
                    or performs any duty for itself or for the other Party as
                    required by the Agreement, the Party will be construed to be
                    acting as an independent contractor. This Agreement is not
                    intended to confer any right or benefit on any third party,
                    except a Lender who has financed through the Program a
                    purchase of goods or services from Dealer. No action may be
                    commenced or prosecuted against a Party by any third-party
                    claimant as a third-party beneficiary of this Agreement,
                    except a Lender who has financed through the Program a
                    purchase of goods or services from Dealer.
                  </div>
                </li>
                <li>
                  <div className="note">
                    <span className="underline">
                      Consent to Electronic Communication.
                    </span>
                    Dealer irrevocably consents and agrees: (i) that Mirza may
                    provide all information and disclosures required by law to
                    Dealer electronically; (ii) that Dealer’s electronic
                    signature on this Agreement and any related documents has
                    the same effect as if Dealer signed them in ink; and (iii)
                    to conduct business with Mirza electronically. This consent
                    applies to acceptance of this Agreement, to all future Mirza
                    communications with Dealer, and to other communications,
                    notices, and disclosures that Mirza provides to Dealer
                    electronically. All communications provided electronically
                    will be deemed to be “in writing.” Mirza reserves the right
                    to cancel electronic disclosure services and to change such
                    services or send disclosures in paper form at any time.
                    Mirza is responsible for sending notice of any such
                    disclosures to Dealer electronically, but Mirza is not
                    responsible for any delay or failure in Dealer’s receipt or
                    review.
                  </div>
                </li>
                <li>
                  <div className="note">
                    <span className="underline">Notices.</span>
                    Any notice or consent under this Agreement will be in
                    writing and delivered personally, by nationally-recognized
                    overnight delivery service, or by prepaid registered or
                    certified mail, or by email, addressed to the addresses set
                    forth below or at such other address as a Party may from
                    time to time designate. Notice is deemed delivered on: (i)
                    the date of actual personal service; (ii) the business day
                    after delivery of overnight delivery; (iii) the date of
                    delivery via registered or certified U.S. mail; or (iv) the
                    date of delivery via email. Notice will be delivered to the
                    respective Parties as follows, or such other addresses or
                    email addresses as specified win writing by the respective
                    Parties from time to time:
                  </div>
                </li>
              </ol>
            </li>
          </ol>
        </li>
      </ul>
      {signature ? <img src={signature} alt="signature" /> : ""}
    </Wrapper>
  );
};

export default Agreement;
