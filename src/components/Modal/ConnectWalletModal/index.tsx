import { css, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { Col, Row, useScreenClass } from "react-grid-system";
import ReactModal from "react-modal";
import Modal from "components/Modal";

import { ConnectType, useWallet } from "@xpla/wallet-provider";
import { MouseEventHandler } from "react";
import Typography from "components/Typography";
import Hr from "components/Hr";
import { MOBILE_SCREEN_CLASS } from "constants/layout";
import iconInstall from "assets/icons/icon-install.svg";
import iconInstalled from "assets/icons/icon-installed.svg";

const WalletButton = styled.button`
  width: auto;
  height: 89px;
  position: relative;
  background-color: transparent;
  margin: 0;
  border: none;
  font-style: normal;
  font-weight: 600;
  font-size: 13px;
  text-align: center;

  cursor: pointer;
`;

WalletButton.defaultProps = {
  type: "button",
};

type WalletButtonProps = {
  label: string;
  iconSrc: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  isInstalled?: boolean;
};

function ConnectWalletModal(props: ReactModal.Props) {
  const { availableConnections, availableInstallations } = useWallet();
  const { connect } = useWallet();
  const theme = useTheme();
  const screenClass = useScreenClass();

  const buttons: WalletButtonProps[] = [
    ...availableConnections
      .filter(({ type }) => type !== ConnectType.READONLY)
      .map(
        ({ type, icon, name, identifier }) =>
          ({
            label: name,
            iconSrc: icon,
            isInstalled: true,
            onClick: (event) => {
              connect(type, identifier, false);
              if (props.onRequestClose) {
                props.onRequestClose(event);
              }
            },
          } as WalletButtonProps),
      ),
    ...availableInstallations
      .filter(({ type }) => type !== ConnectType.READONLY)
      .map(({ icon, name, url }) => ({
        label: `${name}`,
        iconSrc: icon,
        onClick: () => {
          window.open(url);
        },
      })),
  ];

  return (
    <Modal
      drawer={screenClass === MOBILE_SCREEN_CLASS}
      hasCloseButton
      title="Connect to a wallet"
      {...props}
    >
      <Hr size={1} />
      <Typography
        color={theme.colors.primary}
        size={16}
        weight="normal"
        css={css`
          padding-top: 20px;
        `}
      >
        By connecting a wallet, you understand and agree to Dezswap’s
        Disclaimer. Wallets are provided by third parties. By connecting your
        wallet is considered that you agree to their terms and conditions.
        Always trade at your own risk.
      </Typography>
      <Row gutterWidth={0}>
        {buttons.map((item) => (
          <Col
            xs={6}
            sm={4}
            key={item.label}
            style={{
              paddingTop: screenClass === MOBILE_SCREEN_CLASS ? "30px" : "20px",
              textAlign: "center",
            }}
          >
            <WalletButton
              onClick={item.onClick}
              style={{ justifyContent: "center" }}
            >
              <Row direction="column" style={{ height: "100%" }}>
                <Col style={{ flex: "unset" }}>
                  <div
                    css={css`
                      width: 60px;
                      height: 60px;
                      display: inline-block;
                      background-size: contain;
                      background-position: 50% 50%;
                      background-repeat: no-repeat;
                      background-image: url(${item.iconSrc});
                      text-align: right;
                    `}
                  >
                    <div
                      css={css`
                        width: 60px;
                        height: 60px;
                        display: inline-block;
                        background-size: 22px 22px;
                        background-repeat: no-repeat;
                        background-position: bottom right;
                        background-image: url(${item.isInstalled
                          ? iconInstalled
                          : iconInstall});
                      `}
                    />
                  </div>
                </Col>
                <Col style={{ height: "20px" }}>
                  <Typography
                    color={theme.colors.primary}
                    weight={900}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {item.label}
                  </Typography>
                </Col>
              </Row>
            </WalletButton>
          </Col>
        ))}
      </Row>
    </Modal>
  );
}

export default ConnectWalletModal;
