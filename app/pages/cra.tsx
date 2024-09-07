import { parseDate } from '@internationalized/date';
import { Button } from '@nextui-org/button';
import { Card, CardBody } from '@nextui-org/card';
import { DatePicker } from '@nextui-org/date-picker';
import { Input } from '@nextui-org/input';
import { Spinner } from '@nextui-org/react';
import { Select, SelectItem } from '@nextui-org/select';
import { Spacer } from '@nextui-org/spacer';
import { Switch } from '@nextui-org/switch';
import { SortDescriptor, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table';
import { Tooltip } from '@nextui-org/tooltip';
import { RiAddLine, RiCloseCircleLine, RiLoopRightLine } from '@remixicon/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Flex, Metric, Text, Title } from '../components/main';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useWindowParam } from '../hooks/useWindowParam';
import { cls, inputClassNames } from '../utils';

const dateToString = (date: Date) =>
  date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);

enum Currencies {
  DU = 'DU',
  G1 = 'G1',
}

type Friend = {
  name: string;
  date: string;
};
type dbFriend = Friend & {
  [key: string]: string | number;
  displayName: string;
  displayDate: string;
  price: string;
  du: number;
};

const Block0Date = '2017-03-08';
const TodayDate = dateToString(new Date());
const baseFriends: Friend[] = [
  { name: 'Bloc 0', date: Block0Date },
  { name: 'Newbie', date: TodayDate },
];

const getDays = (date: string | undefined) => {
  if (!date) return 0;
  const d = new Date(date);
  const today = new Date();
  const days = Math.abs(d.getTime() - today.getTime()) / (1000 * 3600 * 24);
  return Math.floor(days);
};

const getRatio = (date1: string | undefined, date2: string | undefined) => {
  return getDays(date1) / Math.max(getDays(date2), 1);
};

export function CRA() {
  const { isReady } = useWindowParam();

  const [price, setPrice] = useLocalStorage('price', '1');
  const [discount, setDiscount] = useLocalStorage('discount', '0');
  const [myDate, setMyDate] = useLocalStorage<string | undefined>('myDate', undefined);
  const [isSeller, setIsSeller] = useLocalStorage('isSeller', true);
  const [currency, setCurrency] = useLocalStorage('currency', 'DU');
  const [otherName, setOtherName] = useState('');
  const [otherDate, setOtherDate] = useState<string | undefined>();
  const [friends, setFriends] = useLocalStorage<Friend[]>('friends', []);

  const getFinalPrice = useCallback(
    (date: string | undefined) => {
      if ((!date && !myDate) || (!date && !otherDate)) return Number(price);
      const ratio = date
        ? myDate && (!isSeller || !otherDate)
          ? getRatio(date, myDate)
          : getRatio(date, otherDate)
        : 1;
      const d = Number(discount) / 100;
      const p = Number(price);
      return (1 - d) * p + d * p * ratio;
    },
    [price, discount, myDate, otherDate, isSeller],
  );

  const addFriend = useCallback(() => {
    if (!otherDate || !otherName) return;

    if (friends.some((friend) => friend.name === otherName)) {
      setFriends((friends) =>
        friends.map((friend) => (friend.name === otherName ? { ...friend, date: otherDate } : friend)),
      );
    } else {
      setFriends((friends) => [...friends, { name: otherName, date: otherDate }]);
    }
  }, [otherDate, otherName, friends, setFriends]);

  const removeFriend = useCallback(
    (name: string) => setFriends((friends) => friends.filter((friend) => friend.name !== name)),
    [setFriends],
  );

  const isBaseFriend = useMemo(
    () => baseFriends.some((f) => f.name === otherName && f.date === otherDate),
    [otherName, otherDate],
  );
  const isFriend = useMemo(
    () => friends.some((f) => f.name === otherName && f.date === otherDate),
    [otherName, otherDate, friends],
  );

  const data = useMemo(
    () =>
      isReady
        ? {
            price: price,
            discount: discount,
            myDate: myDate,
            isSeller: isSeller,
            friends: friends,
          }
        : {},
    [myDate, isSeller, price, discount, friends, isReady],
  );

  useEffect(() => {
    if (isReady) {
      setItems(
        baseFriends.concat(data.friends ?? []).map(
          (friend, index) =>
            ({
              ...friend,
              displayName: friend.name.substring(0, 10),
              displayDate: new Date(friend.date).toLocaleDateString('fr-FR', { dateStyle: 'short' }),
              price: getFinalPrice(friend.date)?.toFixed(2),
              du: getDays(friend.date),
            } as dbFriend),
        ),
      );
    }
  }, [isReady, data.friends, getFinalPrice]);

  const [items, setItems] = useState<dbFriend[]>([]);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({ column: 'name', direction: 'ascending' });

  const sort = useCallback(
    (sortDescriptor: SortDescriptor) => {
      setItems(
        items.toSorted((a, b) => {
          const descriptor = (sortDescriptor.column as string) ?? 'name';
          const first = a[descriptor];
          const second = b[descriptor];
          const cmp = () => {
            switch (descriptor) {
              case 'name':
                return (first as string).localeCompare(second as string);
              case 'price':
              case 'du':
                return Number(first) - Number(second);
              case 'date':
                return new Date(first).getTime() - new Date(second).getTime();
              default:
                return 0;
            }
          };
          return cmp() * (sortDescriptor.direction === 'ascending' ? 1 : -1);
        }),
      );
      setSortDescriptor(sortDescriptor);
    },
    [items],
  );

  return (
    <Flex className="sm:p-4 sm:m-4 gap-8" flexDirection="column">
      <Card>
        <CardBody className="items-center gap-4">
          <Metric>Coefficient relatif à l&apos;ancienneté</Metric>
          <Flex justifyContent="center" className="w-full gap-4 max-w-80">
            <DatePicker
              label="Mon ancienneté"
              showMonthAndYearPickers
              minValue={parseDate(Block0Date)}
              maxValue={parseDate(TodayDate)}
              value={data.myDate ? parseDate(data.myDate) : undefined}
              onChange={(d) => setMyDate(d?.toString())}
            />
            <Text className={cls('text-center', data.myDate ? '' : 'invisible')}>
              {getDays(data.myDate) || 0} DUs créés
            </Text>
          </Flex>
          <Flex className="mx-auto items-center justify-center">
            <Title className="mt-4">Mon rôle :</Title>
            <Spacer x={4} />
            <Text>Vendeur</Text>
            <Switch className="ml-2" color="warning" checked={data.isSeller} onValueChange={setIsSeller} />
            <Text>Acheteur</Text>
          </Flex>
          <Flex justifyContent="center" className="w-full gap-4 max-w-80">
            <Input
              label={'Nom ' + (!data.isSeller ? "de l'acheteur" : 'du vendeur')}
              isClearable
              value={otherName}
              onValueChange={setOtherName}
              maxLength={25}
              classNames={inputClassNames}
            />
            <Tooltip
              color="warning"
              content={friends.some((f) => f.name === otherName) ? 'Mettre à jour' : 'Ajouter ami'}
            >
              <Button
                className={cls('self-center', isBaseFriend ? 'invisible' : '')}
                color="warning"
                radius="full"
                size="sm"
                isDisabled={!otherName || !otherDate || isFriend}
                onClick={addFriend}
                isIconOnly
              >
                {friends.some((f) => f.name === otherName) ? <RiLoopRightLine /> : <RiAddLine />}
              </Button>
            </Tooltip>
          </Flex>
          <Title className="mt-4"></Title>
          <Flex justifyContent="center" className="w-full gap-4 max-w-80">
            <DatePicker
              className="max-w-64"
              label={'Ancienneté ' + (otherName ? 'de ' + otherName : !data.isSeller ? "de l'acheteur" : 'du vendeur')}
              showMonthAndYearPickers
              minValue={parseDate(Block0Date)}
              maxValue={parseDate(TodayDate)}
              value={otherDate ? parseDate(otherDate) : undefined}
              onChange={(d) => setOtherDate(d?.toString())}
            />
            <Text className={cls('text-center', otherDate ? '' : 'invisible')}>
              {getDays(otherDate) || 0} DUs créés
            </Text>
          </Flex>
          <Title className="mt-4 hidden">
            Ratio : {otherDate && data.myDate ? (getDays(otherDate) / getDays(data.myDate)).toFixed(2) : 1}
          </Title>
          <Input
            className="justify-center"
            classNames={{ input: [...inputClassNames.input], inputWrapper: ['w-40'] }}
            type="number"
            label="Prix de réf."
            placeholder="0.00"
            labelPlacement="outside-left"
            min={0}
            step={Math.ceil(Number(price) / 10 / 2)}
            value={data.price ?? '1'}
            onValueChange={(p) => setPrice(Math.min(Number(p), 9999).toString())}
            endContent={
              <div className="flex items-center">
                <label className="sr-only" htmlFor="currency">
                  Currency
                </label>
                <select
                  id="currency"
                  className="outline-none border-0 bg-transparent text-default-400 text-small cursor-pointer"
                  value={currency}
                  onChange={(e) => {
                    setCurrency(e.target.value);
                    setPrice('1');
                  }}
                >
                  {Object.values(Currencies).map((c) => (
                    <option
                      key={c}
                      value={c}
                      className="bg-content3 dark:bg-content3 hover:dark:bg-blue-900 hover:dark:text-white"
                    >
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            }
          />
          <Input
            className="justify-center"
            classNames={{ input: [...inputClassNames.input], inputWrapper: ['w-40'] }}
            type="number"
            label="Réduction newbie"
            placeholder="0"
            labelPlacement="outside-left"
            min={0}
            step={Math.ceil(Number(discount) / 10 / 2)}
            value={data.discount ?? '0'}
            onValueChange={(p) => setDiscount(Math.min(Number(p), 99).toString())}
            endContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">%</span>
              </div>
            }
          />
          <Title className="mt-4">
            Prix corrigé : {getFinalPrice(data.isSeller ? data.myDate : otherDate).toFixed(2)}
          </Title>
        </CardBody>
      </Card>

      <Card className="">
        <CardBody className="items-center gap-4 px-0">
          <Metric>Mes amis</Metric>
          <Table
            aria-label="Liste des amis"
            isStriped
            disabledKeys={['0', '1']}
            sortDescriptor={sortDescriptor}
            onSortChange={sort}
          >
            <TableHeader>
              <TableColumn key="name" allowsSorting>
                NOM
              </TableColumn>
              <TableColumn key="price" allowsSorting>
                PRIX
              </TableColumn>
              <TableColumn key="date" allowsSorting>
                DATE
              </TableColumn>
              <TableColumn key="du" allowsSorting>
                DU
              </TableColumn>
              <TableColumn> </TableColumn>
            </TableHeader>
            <TableBody
              emptyContent="Aucun ami :-("
              isLoading={!isReady}
              items={items}
              loadingContent={<Spinner label="Loading..." />}
            >
              {(friend) => (
                <TableRow
                  key={friend.name}
                  className="cursor-pointer"
                  onClick={() => {
                    setOtherName(friend.name);
                    setOtherDate(friend.date);
                  }}
                >
                  <TableCell>{friend.displayName} </TableCell>
                  <TableCell>{friend.price}</TableCell>
                  <TableCell>{friend.displayDate}</TableCell>
                  <TableCell>{friend.du}</TableCell>
                  {!baseFriends.some(({ name, date }) => name === friend.name && date === friend.date) ? (
                    <TableCell className="py-1">
                      <Tooltip color="danger" content="Effacer ami">
                        <span className="text-lg text-danger cursor-pointer active:opacity-50">
                          <RiCloseCircleLine onClick={() => removeFriend(friend.name)} />
                        </span>
                      </Tooltip>
                    </TableCell>
                  ) : (
                    <TableCell> </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </Flex>
  );
}
