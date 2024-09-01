'use client';

import { Flex, Metric } from './components/main';
import { CRA } from './cra';
import { Tabs, Tab } from '@nextui-org/tabs';
import { NextUIProvider } from '@nextui-org/system';
import { Card, CardBody } from '@nextui-org/card';

export default function Home() {
  return (
    <main className="dark flex h-screen flex-col items-center justify-between p-24">
      <NextUIProvider>
        <Card>
          <CardBody>
            <Metric style={{ paddingBottom: 20, fontSize: '1.875rem' }}>Price Wizard</Metric>
            <Tabs className="self-center" color="warning" radius="full" size="sm" disabledKeys={['2', '3']}>
              <Tab key="1" title="Ancienneté">
                <CRA />
              </Tab>
              <Tab key="2" title="Quantité"></Tab>
              <Tab key="3" title="Moyenne (M / N)"></Tab>
            </Tabs>
          </CardBody>
        </Card>
      </NextUIProvider>
    </main>
  );
}
