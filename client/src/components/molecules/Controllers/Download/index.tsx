import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as Icon } from "../../../../assets/svgs/download.svg";

const DownLoadButton = ({ link }: { link: string }) => {
  return (
    <Link target="_blank" download to={link}>
      <Icon />
    </Link>
  );
};

export default DownLoadButton;
