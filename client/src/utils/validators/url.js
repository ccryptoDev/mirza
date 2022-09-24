import { urlRegexp } from "../regexp";

export const validateUrl = (url) => String(url).toLowerCase().match(urlRegexp);
