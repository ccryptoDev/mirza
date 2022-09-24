import React from "react";
import styled from "styled-components";
import benefit from "../../assets/svgs/illustrations/benefit.svg";
import bigFamily from "../../assets/svgs/illustrations/big-family.svg";
import childGrandparents from "../../assets/svgs/illustrations/child-grandparents.svg";
import cure from "../../assets/svgs/illustrations/cure.svg";
import discussPregnancy from "../../assets/svgs/illustrations/discuss-pregnancy.svg";
import diagnose from "../../assets/svgs/illustrations/diagnose.svg";
import dna from "../../assets/svgs/illustrations/dna.svg";
import doctor from "../../assets/svgs/illustrations/doctor.svg";
import earnMoney from "../../assets/svgs/illustrations/earn-money.svg";
import explore from "../../assets/svgs/illustrations/explore.svg";
import fertilize from "../../assets/svgs/illustrations/fertilize.svg";
import fertilize2 from "../../assets/svgs/illustrations/fertilize-2.svg";
import gamble from "../../assets/svgs/illustrations/gamble.svg";
import giveBirth from "../../assets/svgs/illustrations/give-birth.svg";
import growMoney from "../../assets/svgs/illustrations/grow-money.svg";
import growMoney2 from "../../assets/svgs/illustrations/grow-money-2.svg";
import growPeople from "../../assets/svgs/illustrations/grow-people.svg";
import growth from "../../assets/svgs/illustrations/growth.svg";
import heart from "../../assets/svgs/illustrations/heart.svg";
import helpGrow from "../../assets/svgs/illustrations/help-grow.svg";
import identity from "../../assets/svgs/illustrations/identity.svg";
import mail from "../../assets/svgs/illustrations/mail.svg";
import microscope from "../../assets/svgs/illustrations/microscope.svg";
import microscope2 from "../../assets/svgs/illustrations/microscope-2.svg";
import moneyHappiness from "../../assets/svgs/illustrations/money-happiness.svg";
import motherChild from "../../assets/svgs/illustrations/mother-child.svg";
import motherChild2 from "../../assets/svgs/illustrations/mother-child-2.svg";
import onlineShopping from "../../assets/svgs/illustrations/online-shopping.svg";
import playWithChild from "../../assets/svgs/illustrations/play-with-child.svg";
import playWithKids from "../../assets/svgs/illustrations/play-with-kids.svg";
import pregnancy from "../../assets/svgs/illustrations/pregnancy.svg";
import pregnancy2 from "../../assets/svgs/illustrations/pregnancy-2.svg";
import pregnancyScan from "../../assets/svgs/illustrations/pregnancy-scan.svg";
import presentation from "../../assets/svgs/illustrations/presentation.svg";
import savings from "../../assets/svgs/illustrations/savings.svg";
import scales from "../../assets/svgs/illustrations/scales.svg";
import schoolClass from "../../assets/svgs/illustrations/school-class.svg";
import screen from "../../assets/svgs/illustrations/screen.svg";
import seeDoctor from "../../assets/svgs/illustrations/see-doctor.svg";
import sitWithChild from "../../assets/svgs/illustrations/sit-with-child.svg";
import taxCredit1 from "../../assets/svgs/illustrations/tax-credit-1.svg";
import taxCredit2 from "../../assets/svgs/illustrations/tax-credit-2.svg";
import taxReturn from "../../assets/svgs/illustrations/tax-return.svg";
import vacant from "../../assets/svgs/illustrations/vacant.svg";
import woman from "../../assets/svgs/illustrations/woman.svg";
import work from "../../assets/svgs/illustrations/work.svg";
import gayCouple from "../../assets/svgs/illustrations/gay-couple.svg";
import familyMoney from "../../assets/svgs/illustrations/family-money.svg";
import findEmployer from "../../assets/svgs/illustrations/find-employer.svg";
import getCheck from "../../assets/svgs/illustrations/get-check.svg";
import growMoney3 from "../../assets/svgs/illustrations/grow-money-3.svg";
import happyShopping from "../../assets/svgs/illustrations/happy-shopping.svg";
import joy from "../../assets/svgs/illustrations/joy.svg";
import motherMoney from "../../assets/svgs/illustrations/mother-money.svg";
import ride from "../../assets/svgs/illustrations/ride.svg";
import singContract from "../../assets/svgs/illustrations/sing-contract.svg";
import viewBills from "../../assets/svgs/illustrations/view-bills.svg";

const Wrapper = styled.div`
  padding: 40px;
  section {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;

    & .illustration img {
      width: 200px;
    }
  }
`;

const illustrations = [
  { label: "benefit", value: benefit },
  { label: "big-family", value: bigFamily },
  { label: "child-grandparents", value: childGrandparents },
  { label: "cure", value: cure },
  { label: "discuss-pregnancy", value: discussPregnancy },
  { label: "diagnose", value: diagnose },
  { label: "dna", value: dna },
  { label: "doctor", value: doctor },
  { label: "earn-money", value: earnMoney },
  { label: "explore", value: explore },
  { label: "fertilize", value: fertilize },
  { label: "fertilize-2", value: fertilize2 },
  { label: "gamble", value: gamble },
  { label: "gay-couple", value: gayCouple },
  { label: "give-birth", value: giveBirth },
  { label: "grow-money", value: growMoney },
  { label: "grow-money-2", value: growMoney2 },
  { label: "grow-people", value: growPeople },
  { label: "growth", value: growth },
  { label: "heart", value: heart },
  { label: "help-grow", value: helpGrow },
  { label: "identity", value: identity },
  { label: "mail", value: mail },
  { label: "microscope", value: microscope },
  { label: "microscope-2", value: microscope2 },
  { label: "money-happiness", value: moneyHappiness },
  { label: "mother-child", value: motherChild },
  { label: "mother-child-2", value: motherChild2 },
  { label: "online-shopping", value: onlineShopping },
  { label: "play-with-child", value: playWithChild },
  { label: "play-with-kids", value: playWithKids },
  { label: "pregnancy", value: pregnancy },
  { label: "pregnancy-2", value: pregnancy2 },
  { label: "pregnancy-scan", value: pregnancyScan },
  { label: "presentation", value: presentation },
  { label: "savings", value: savings },
  { label: "scales", value: scales },
  { label: "school-class", value: schoolClass },
  { label: "screen", value: screen },
  { label: "see-doctor", value: seeDoctor },
  { label: "sit-with-child", value: sitWithChild },
  { label: "tax-credit-1", value: taxCredit1 },
  { label: "tax-credit-2", value: taxCredit2 },
  { label: "tax-return", value: taxReturn },
  { label: "vacant", value: vacant },
  { label: "woman", value: woman },
  { label: "family-money", value: familyMoney },
  { label: "find-employer", value: findEmployer },
  { label: "get-check", value: getCheck },
  { label: "happy-shopping", value: happyShopping },
  { label: "joy", value: joy },
  { label: "mother-money", value: motherMoney },
  { label: "ride", value: ride },
  { label: "sing-contract", value: singContract },
  { label: "view-bills", value: viewBills },
  { label: "work", value: work },
  { label: "grow-money-3", value: growMoney3 },
];

const Image = ({ label, value }) => {
  return (
    <div className="illustration">
      <div className="label">illustrations/{label}.svg</div>
      <img src={value} alt={label} />
    </div>
  );
};

const Illustrations = () => {
  return (
    <Wrapper>
      <section>
        {illustrations.map((item) => (
          <Image key={item.label} {...item} />
        ))}
      </section>
    </Wrapper>
  );
};

export default Illustrations;
