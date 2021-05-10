import React from "react";
import { Link } from "react-router-dom";

import {
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiTitle,
  EuiSpacer,
  EuiListGroup,
  EuiListGroupItem,
  EuiAvatar,
  EuiFlexGroup,
  EuiFlexItem,
  EuiHorizontalRule,
  EuiButton,
} from "@elastic/eui";

import Header from "../components/Header";

const ViewDatasetPage: React.FC = () => {
  const breadcrumbs = [
    {
      text: "Datasets",
    },
  ];

  return (
    <React.Fragment>
      <Header breadcrumbs={breadcrumbs} />
      <EuiPage paddingSize="none">
        <EuiPageBody panelled panelProps={{ hasShadow: false }}>
          <EuiPageContent
            hasBorder={false}
            hasShadow={false}
            paddingSize="none"
            color="transparent"
            borderRadius="none"
            horizontalPosition="center"
          >
            <EuiPageContentBody style={{ textAlign: "center" }}>
              <EuiSpacer size="l" />
              <EuiTitle>
                <h1>Datasets</h1>
              </EuiTitle>

              <EuiSpacer size="xl" />

              <EuiFlexGroup>
                <EuiFlexItem>
                  <EuiListGroup style={{ minWidth: 500, maxWidth: 1000 }}>
                    <EuiListGroupItem
                      icon={
                        <EuiAvatar
                          size="s"
                          type="space"
                          name="Reddit Submissions"
                        />
                      }
                      onClick={() => {}}
                      label="Reddit Submissions"
                      extraAction={{
                        color: "subdued",
                        onClick: () => {},
                        iconType: "eye",
                      }}
                    />
                    <EuiListGroupItem
                      icon={
                        <EuiAvatar
                          size="s"
                          type="space"
                          name="Reddit Comments"
                        />
                      }
                      onClick={() => {}}
                      label="Reddit Comments"
                      extraAction={{
                        color: "subdued",
                        onClick: () => {},
                        iconType: "eye",
                      }}
                    />
                    <EuiListGroupItem
                      icon={
                        <EuiAvatar
                          size="s"
                          type="space"
                          name="Reddit Comments Tagging 2020"
                        />
                      }
                      onClick={() => {}}
                      label="Reddit Comments Tagging 2020"
                      extraAction={{
                        color: "subdued",
                        onClick: () => {},
                        iconType: "eye",
                      }}
                    />
                  </EuiListGroup>
                </EuiFlexItem>
              </EuiFlexGroup>

              <EuiHorizontalRule margin="l" />

              <EuiButton iconType="plus">
                <Link to="/datasets/create">Create new dataset</Link>
              </EuiButton>
            </EuiPageContentBody>
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    </React.Fragment>
  );
};

export default ViewDatasetPage;
