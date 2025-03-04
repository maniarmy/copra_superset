/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { ReactNode, useState, useEffect, FunctionComponent } from 'react';

import { Link, useHistory } from 'react-router-dom';
import { styled, SupersetTheme, css, t } from '@superset-ui/core';
import cx from 'classnames';
import { Tooltip } from 'src/components/Tooltip';
import { debounce } from 'lodash';
import { Row } from 'src/components';
import { Menu, MenuMode, MainNav } from 'src/components/Menu';
import Button, { OnClickHandler } from 'src/components/Button';
import Icons from 'src/components/Icons';
import { MenuObjectProps } from 'src/types/bootstrapTypes';

import { Row as AntRow, Col } from "antd"; // Ant Design Layout
import "@fontsource/caveat";

import tzImage from 'src/assets/images/tz.png';
import logoImage from 'src/assets/images/logo.png';
import topbanner from 'src/assets/images/topbanner.png';

//margin-right: ${({ theme }) => theme.gridUnit * 3}px;
const StyledHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.gridUnit * 4}px;
  .header {
    font-weight: ${({ theme }) => theme.typography.weights.bold};
    text-align: left;
    font-size: 18px;
    padding: ${({ theme }) => theme.gridUnit * 3}px;
    display: flex;
    justify-content: space-between;

    line-height: ${({ theme }) => theme.gridUnit * 9}px;
    width:100%;
    height:100px;
  }
  
  .header-image{
   width: 100px;
   height: 85px;
  }
  
  .nav-right {
    display: flex;
    align-items: center;
    padding: ${({ theme }) => theme.gridUnit * 3.5}px 0;
    margin-right: ${({ theme }) => theme.gridUnit * 3}px;
    float: right;
    position: absolute;
    right: 0;
    ul.antd5-menu-root {
      padding: 0px;
    }
    li[role='menuitem'] {
      border: 0;
      border-bottom: none;
      &:hover {
        border-bottom: transparent;
      }
    }
  }
  .nav-right-collapse {
    display: flex;
    align-items: center;
    padding: 14px 0;
    margin-right: 0;
    float: left;
    padding-left: 10px;
  }
  .menu {
    background-color: ${({ theme }) => theme.colors.grayscale.light5};
  }

  .menu > .antd5-menu {
    padding: ${({ theme }) => theme.gridUnit * 5}px
      ${({ theme }) => theme.gridUnit * 8}px;

    .antd5-menu-item {
      border-radius: ${({ theme }) => theme.borderRadius}px;
      font-size: ${({ theme }) => theme.typography.sizes.s}px;
      padding: ${({ theme }) => theme.gridUnit}px
        ${({ theme }) => theme.gridUnit * 4}px;
      margin-right: ${({ theme }) => theme.gridUnit}px;
    }
    .antd5-menu-item:hover,
    .antd5-menu-item:has(> span > .active) {
      background-color: ${({ theme }) => theme.colors.success.base};
    }
  }

  .btn-link {
    padding: 10px 0;
  }
  @media (max-width: 767px) {
    .header,
    .nav-right {
      position: relative;
      margin-left: ${({ theme }) => theme.gridUnit * 2}px;
    }
  }
`;

const styledDisabled = (theme: SupersetTheme) => css`
  color: ${theme.colors.grayscale.light1};
  cursor: not-allowed;

  &:hover {
    color: ${theme.colors.grayscale.light1};
  }

  .antd5-menu-item-selected {
    background-color: ${theme.colors.grayscale.light1};
  }
`;

type MenuChild = {
  label: string;
  name: string;
  url?: string;
  usesRouter?: boolean;
  onClick?: () => void;
  'data-test'?: string;
};

export interface ButtonProps {
  name: ReactNode;
  onClick?: OnClickHandler;
  'data-test'?: string;
  buttonStyle:
    | 'primary'
    | 'secondary'
    | 'dashed'
    | 'link'
    | 'warning'
    | 'success'
    | 'tertiary';
}

export interface SubMenuProps {
  buttons?: Array<ButtonProps>;
  name?: string | ReactNode;
  tabs?: MenuChild[];
  activeChild?: MenuChild['name'];
  /* If usesRouter is true, a react-router <Link> component will be used instead of href.
   *  ONLY set usesRouter to true if SubMenu is wrapped in a react-router <Router>;
   *  otherwise, a 'You should not use <Link> outside a <Router>' error will be thrown */
  usesRouter?: boolean;
  color?: string;
  dropDownLinks?: Array<MenuObjectProps>;
}

const { SubMenu } = MainNav;

const SubMenuComponent: FunctionComponent<SubMenuProps> = props => {
  const [showMenu, setMenu] = useState<MenuMode>('horizontal');
  const [navRightStyle, setNavRightStyle] = useState('nav-right');

  let hasHistory = true;
  // If no parent <Router> component exists, useHistory throws an error
  try {
    useHistory();
  } catch (err) {
    // If error is thrown, we know not to use <Link> in render
    hasHistory = false;
  }

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth <= 767) setMenu('inline');
      else setMenu('horizontal');

      if (
        props.buttons &&
        props.buttons.length >= 3 &&
        window.innerWidth >= 795
      ) {
        // eslint-disable-next-line no-unused-expressions
        setNavRightStyle('nav-right');
      } else if (
        props.buttons &&
        props.buttons.length >= 3 &&
        window.innerWidth <= 795
      ) {
        setNavRightStyle('nav-right-collapse');
      }
    }
    handleResize();
    const resize = debounce(handleResize, 10);
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [props.buttons]);

  return (
    //<img src={myImage} alt="Header" className="header-image" />
    //<img src={logoImage} alt="Header Right" className="header-image" />
    <StyledHeader>
      <Row className="menu" role="navigation">
      {props.name && (
     <>

<div className="px-0 py-3 position-relative bg-header-trans" style={{backgroundSize: "cover", backgroundImage: `url(${topbanner})`, width: "100%"}}>
        <div className="col-md-12 mt-0 py-1 top-middle   ">
            <div className="container px-0 position-relative">
                <div className="row">
                    <div className="col-3 col-lg-2 float-left text-left my-auto">
                        <a href="https://www.copra.go.tz">
                            <img src={tzImage} alt="Tanzania emblem" className="mx-auto img-fluid" width="130px"/>
                        </a>
                    </div>
                    <div className="col-6 p-0 col-md-8 text-center my-auto">
                        <h5 className="mb-1 text-dark title align-items-center ">
                            Jamhuri ya Muungano wa Tanzania
                        </h5>
                        <h2 className="mb-1 text-bold text-green-500 text-center title text-shadow-light align-items-center" style={{ color: "green" }}>
                            Cereals and Other Produce Regulatory Authority
                        </h2>
                        <h1 className="mb-0 text-primary title align-items-center text-shadow-light" style={{ color: "green" }}>
                            (COPRA)
                        </h1>
                    </div>
                    <div className="col-3 col-lg-2  float-right text-right my-auto pt-5 d-flex justify-content-end align-items-center px-0">
                        <a className="w-100" href="https://www.copra.go.tz"><img alt="COPRA Logo" className="mx-auto img-fluid fade-on px-0" src={logoImage} style={{width: "140px"}}/></a>
                    </div>
                </div>
            </div>
        </div>
    </div>



     {/*
       <div className="header">
       
       <h1 className="headone">Cereal and other Produce Regulatory Authority</h1>
       </div>
       */}

       <AntRow justify="center" style={{ width: "100%", height: "1px" }}>
      <Col span={12}  style={{ textAlign: "center", paddingTop: "10px"}}>
      
        <span
          style={{
            fontFamily: "Caveat",
            textAlign: "center",
            fontSize: "18px",
            fontWeight: "bold",
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
            color: "#FFA500", // Equivalent to Bootstrap's text-secondary,
          }}
        >
         "Commercialization of Tanzania’s Food Systems to Catalyze Growth and Resilience"
        </span>
        
      </Col>
    </AntRow>
       
       </>
        )}
        <Menu mode={showMenu} disabledOverflow>
          {props.tabs?.map(tab => {
            if ((props.usesRouter || hasHistory) && !!tab.usesRouter) {
              return (
                <Menu.Item key={tab.label}>
                  <div
                    role="tab"
                    data-test={tab['data-test']}
                    className={tab.name === props.activeChild ? 'active' : ''}
                  >
                    <div>
                      <Link to={tab.url || ''}>{tab.label}</Link>
                    </div>
                  </div>
                </Menu.Item>
              );
            }

            return (
              <Menu.Item key={tab.label}>
                <div
                  className={cx('no-router', {
                    active: tab.name === props.activeChild,
                  })}
                  role="tab"
                >
                  <a href={tab.url} onClick={tab.onClick}>
                    {tab.label}
                  </a>
                </div>
              </Menu.Item>
            );
          })}
        </Menu>
        <div className={navRightStyle}>
          <Menu mode="horizontal" triggerSubMenuAction="click" disabledOverflow>
            {props.dropDownLinks?.map((link, i) => (
              <SubMenu
                key={i}
                title={link.label}
                icon={<Icons.TriangleDown />}
                popupOffset={[10, 20]}
                className="dropdown-menu-links"
              >
                {link.childs?.map(item => {
                  if (typeof item === 'object') {
                    return item.disable ? (
                      <MainNav.Item
                        key={item.label}
                        css={styledDisabled}
                        disabled
                      >
                        <Tooltip
                          placement="top"
                          title={t(
                            "Enable 'Allow file uploads to database' in any database's settings",
                          )}
                        >
                          {item.label}
                        </Tooltip>
                      </MainNav.Item>
                    ) : (
                      <MainNav.Item key={item.label}>
                        <a href={item.url} onClick={item.onClick}>
                          {item.label}
                        </a>
                      </MainNav.Item>
                    );
                  }
                  return null;
                })}
              </SubMenu>
            ))}
          </Menu>
          {props.buttons?.map((btn, i) => (
            <Button
              key={i}
              buttonStyle={btn.buttonStyle}
              onClick={btn.onClick}
              data-test={btn['data-test']}
            >
              {btn.name}
            </Button>
          ))}
        </div>
      </Row>
      {props.children}
    </StyledHeader>
  );
};

export default SubMenuComponent;
