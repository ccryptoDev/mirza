import React, { useEffect, useRef, useState } from "react";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import MenuList from "@material-ui/core/MenuList";
import { Wrapper, DropDown } from "./styles";

const MenuListComposition = ({ button, menu: Menu, ...props }) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleListKeyDown = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  };

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef?.current?.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <Wrapper>
      <div>
        <button
          type="button"
          ref={anchorRef}
          aria-controls={open ? "menu-list-grow" : ""}
          aria-haspopup="true"
          onClick={handleToggle}
          className="trigger-button"
        >
          {button}
        </button>
        <DropDown
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          disablePortal
          className="popper"
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="menu-list-grow"
                  onKeyDown={handleListKeyDown}
                >
                  <Menu {...props} handleClose={handleClose} />
                </MenuList>
              </ClickAwayListener>
            </Grow>
          )}
        </DropDown>
      </div>
    </Wrapper>
  );
};

export default MenuListComposition;
