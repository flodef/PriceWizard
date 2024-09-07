'use client';

import { Card, CardBody } from '@nextui-org/card';
import { NextUIProvider } from '@nextui-org/system';
import { Tab, Tabs } from '@nextui-org/tabs';
import { Metric } from './components/main';
import { useWindowParam } from './hooks/useWindowParam';
import { LoadingDot } from './loading';
import { CRA } from './pages/cra';
import { cls } from './utils';

export default function Home() {
  const { colorScheme, isReady } = useWindowParam();

  return (
    <NextUIProvider>
      <main
        className={cls('flex flex-col items-center sm:p-4 overflow-x-hidden h-screen', colorScheme)}
        style={{ backgroundColor: colorScheme === 'dark' ? '#1e293b' : '#f9fafb' }}
      >
        {!isReady ? (
          <LoadingDot className="bg-orange-400" />
        ) : (
          <Card className="sm:max-w-screen-sm">
            <CardBody>
              <Metric className="pb-5" fontSize="1.75rem">
                Price Wizard
              </Metric>
              <Tabs className="self-center" color="warning" radius="full" size="sm" disabledKeys={['2', '3']}>
                <Tab key="1" title="Ancienneté">
                  <CRA />
                </Tab>
                <Tab key="2" title="Quantité"></Tab>
                <Tab key="3" title="Moyenne (M / N)"></Tab>
              </Tabs>
            </CardBody>
          </Card>
        )}
      </main>
    </NextUIProvider>
  );
}
