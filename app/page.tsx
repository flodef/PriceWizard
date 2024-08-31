'use client';

import { Flex, Metric, Tab, TabGroup, TabList, TabPanel, TabPanels } from '@tremor/react';
import { CRA } from './cra';

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-between p-24">
      <Metric style={{paddingBottom:20}}>Price Wizard</Metric> 
      <TabGroup>
        <Flex justifyContent="center">
          <TabList variant="solid">
            <Tab>Ancienneté</Tab>
            <Tab disabled>Quantité</Tab>
            <Tab disabled>Moyenne (M / N)</Tab>
          </TabList>
        </Flex>
        <TabPanels>
          <TabPanel>
            <CRA />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </main>
  );
}
