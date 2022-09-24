import { createGlobalStyle } from "styled-components";
import Fonts from "./00-settings/fonts.scss";
import Variables from "./00-settings/variables.scss";
import Colors from "./00-settings/colors.scss";
import Mixins from "./01-tools/mixins.scss";
import Reset from "./02-generic/reset.scss";
import Elements from "./03-elements/elements.scss";
import ScrollBar from "./03-elements/scrollbar.scss";
import FontSizing from "./03-elements/base-font-sizing.scss";
import StyleClasses from "./04-utilities/style-classes.scss";
import Pdf from "./03-elements/pdf.scss";

export default createGlobalStyle`
    ${Fonts}
    ${Colors}
    ${Variables}
    ${Mixins}
    ${Reset}
    ${Elements}
    ${ScrollBar}
    ${FontSizing}
    ${StyleClasses}
    ${Pdf}
`;
