import { parseDate } from '@internationalized/date';
import { Button } from '@nextui-org/button';
import { Card } from '@nextui-org/card';
import { DatePicker } from '@nextui-org/date-picker';
import { Input } from '@nextui-org/input';
import { Spacer } from '@nextui-org/spacer';
import { Switch } from '@nextui-org/switch';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table';
import { Tooltip } from '@nextui-org/tooltip';
import { RiAddLine, RiCloseCircleLine, RiLoopRightLine } from '@remixicon/react';
import { useCallback, useMemo, useState } from 'react';
import { Flex, Metric, Text, Title } from './components/main';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useWindowParam } from './hooks/useWindowParam';

const dateToString = (date: Date) =>
  date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);

interface Friend {
  name: string;
  date: string;
}

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

export function CRA() {
  const { isReady } = useWindowParam();

  const [price, setPrice] = useLocalStorage('price', '1');
  const [discount, setDiscount] = useLocalStorage('discount', '0');
  const [myDate, setMyDate] = useLocalStorage<string | undefined>('myDate', undefined);
  const [isSeller, setIsSeller] = useLocalStorage('isSeller', true);
  const [otherName, setOtherName] = useState('');
  const [otherDate, setOtherDate] = useState<string | undefined>();
  const [friends, setFriends] = useLocalStorage<Friend[]>('friends', []);

  const getFinalPrice = (date: string | undefined) => {
    if (!date) return Number(price);
    if (!myDate || !otherDate) return 0;
    const ratio = date ? (!isSeller ? getDays(date) / getDays(myDate) : getDays(date) / getDays(otherDate)) : 1;
    const d = Number(discount) / 100;
    const p = Number(price);
    return (1 - d) * p + d * p * ratio;
  };

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
  return (
    <Flex className="p-4 m-4" flexDirection="column">
      <Card className="flex flex-col items-center justify-center gap-4">
        <Metric>Coefficient relatif à l&apos;ancienneté</Metric>
        <Flex justifyContent="center" style={{ gap: '1rem' }}>
          <DatePicker
            label="Mon ancienneté"
            showMonthAndYearPickers
            minValue={parseDate(Block0Date)}
            maxValue={parseDate(TodayDate)}
            value={data.myDate ? parseDate(data.myDate) : undefined}
            onChange={(d) => setMyDate(d.toString())}
          />
          <Text style={{ alignSelf: 'center' }}>{getDays(data.myDate) || 0} DUs créés</Text>
        </Flex>
        <Flex className="mx-auto items-center justify-center">
          <Title className="mt-4">Mon rôle :</Title>
          <Spacer x={4} />
          <Text>Vendeur</Text>
          <Switch
            style={{ marginLeft: '0.5rem' }}
            color="warning"
            checked={data.isSeller}
            onValueChange={setIsSeller}
          />
          <Text>Acheteur</Text>
        </Flex>
        <Flex justifyContent="center" style={{ gap: '1rem' }}>
          <Input
            label={'Nom ' + (!data.isSeller ? "de l'acheteur" : 'du vendeur')}
            style={{ border: 0 }}
            className="focus:border-none"
            value={otherName}
            onValueChange={setOtherName}
          />
          <Tooltip
            color="warning"
            content={friends.some((f) => f.name === otherName) ? 'Mettre à jour' : 'Ajouter ami'}
          >
            <Button
              style={{ alignSelf: 'center' }}
              color="warning"
              radius="full"
              size="sm"
              isDisabled={!otherName || !otherDate || friends.some((f) => f.name === otherName && f.date === otherDate)}
              onClick={addFriend}
              isIconOnly
            >
              {friends.some((f) => f.name === otherName) ? <RiLoopRightLine /> : <RiAddLine />}
            </Button>
          </Tooltip>
        </Flex>
        <Title className="mt-4"></Title>
        <Flex justifyContent="center" style={{ gap: '1rem' }}>
          <DatePicker
            label={'Ancienneté ' + (otherName ? 'de ' + otherName : !data.isSeller ? "de l'acheteur" : 'du vendeur')}
            showMonthAndYearPickers
            minValue={parseDate(Block0Date)}
            maxValue={parseDate(TodayDate)}
            value={otherDate ? parseDate(otherDate) : undefined}
            onChange={(d) => setOtherDate(d?.toString())}
          />
          <Text style={{ alignSelf: 'center' }}>{getDays(otherDate) || 0} DUs créés</Text>
        </Flex>
        <Title className="mt-4 hidden">
          Ratio : {otherDate && data.myDate ? (getDays(otherDate) / getDays(data.myDate)).toFixed(2) : 1}
        </Title>
        <Input
          className="w-40"
          style={{ width: 100, border: 0 }}
          type="number"
          label="Prix de réf."
          placeholder="0.00"
          labelPlacement="outside-left"
          min={0}
          step={0.5}
          value={data.price ?? '1'}
          onValueChange={setPrice}
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">DU</span>
            </div>
          }
        />
        <Input
          className="w-40"
          style={{ width: 100, border: 0 }}
          type="number"
          label="Réduction newbie"
          placeholder="0"
          labelPlacement="outside-left"
          min={0}
          max={100}
          step={25}
          value={data.discount ?? '0'}
          onValueChange={setDiscount}
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">%</span>
            </div>
          }
        />
        <Title className="mt-4">
          Prix corrigé : {getFinalPrice(data.isSeller ? data.myDate : otherDate).toFixed(2)}
        </Title>
      </Card>
      <Flex className="w-8 h-8" style={{ visibility: 'hidden' }}>
        <Title>xxx</Title>
      </Flex>
      <Card className="ml-8 flex flex-col items-center justify-center gap-4">
        <Metric className="text-center text-xl">Mes amis</Metric>
        <Table isStriped>
          <TableHeader>
            <TableColumn>NOM</TableColumn>
            <TableColumn>PRIX CORRIGÉ</TableColumn>
            <TableColumn>DATE CRÉATION</TableColumn>
            <TableColumn>NOMBRE DE DU</TableColumn>
            <TableColumn> </TableColumn>
          </TableHeader>

          <TableBody emptyContent="Aucun ami :-(">
            {isReady ? (
              baseFriends
                .concat(data.friends?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) ?? [])
                .map((friend, index) => (
                  <TableRow key={index}>
                    <TableCell>{friend.name} </TableCell>
                    <TableCell>{getFinalPrice(friend.date)?.toFixed(2)}</TableCell>
                    <TableCell>{new Date(friend.date).toLocaleDateString('fr-FR', { dateStyle: 'long' })}</TableCell>
                    <TableCell>{getDays(friend.date)} DUs créés</TableCell>
                    {!baseFriends.some(({ name }) => name === friend.name) ? (
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
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={5}>
                  <Text className="text-center">Chargement en cours...</Text>
                </TableCell>
                <TableCell> </TableCell>
                <TableCell> </TableCell>
                <TableCell> </TableCell>
                <TableCell> </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </Flex>
  );
}
