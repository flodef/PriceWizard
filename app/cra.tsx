import { RiCloseCircleLine } from '@remixicon/react';
import {
    Card,
    DatePicker,
    DatePickerValue,
    Flex,
    Grid,
    Icon,
    Metric,
    NumberInput,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
    Text,
    TextInput,
    Title,
} from '@tremor/react';
import { useEffect, useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';

const convertDate = (date?: DatePickerValue) => (date ? dateToString(new Date(date.toDateString())) : '');
const dateToString = (date: Date) =>
  date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);

interface Friend {
  name: string;
  date: string;
}

const baseFriends: Friend[] = [
  { name: 'Bloc 0', date: '2017-03-08' },
  { name: 'Newbie', date: dateToString(new Date()) },
];

const getDays = (date: string) => {
  const d = new Date(date);
  const today = new Date();
  const days = Math.abs(d.getTime() - today.getTime()) / (1000 * 3600 * 24);
  return Math.floor(days);
};

export function CRA() {
  const [price, setPrice] = useLocalStorage('price', 1);
  const [discount, setDiscount] = useLocalStorage('discount', 0);
  const [myDate, setMyDate] = useLocalStorage('myDate', '');
  const [isSeller, setIsSeller] = useLocalStorage('isSeller', true);
  const [otherName, setOtherName] = useState('');
  const [otherDate, setOtherDate] = useState('');
  const [friends, setFriends] = useLocalStorage<Friend[]>('friends', baseFriends);

  const getFinalPrice = (date: string) => {
    if (!date) return price;
    const ratio = date ? !isSeller ? getDays(date) / getDays(myDate) : getDays(date) / getDays(otherDate) : 1;
    return (1 - discount / 100) * price + (discount / 100) * price * ratio;
  };

  useEffect(() => {
    if (!otherDate || !otherName) return;

    if (friends.find((friend) => friend.name === otherName)) {
      setFriends((friends) =>
        friends.map((friend) => (friend.name === otherName ? { ...friend, date: otherDate } : friend)),
      );
    } else {
      setFriends((friends) => [...friends, { name: otherName, date: otherDate }]);
    }
  }, [otherDate, otherName]); //eslint-disable-line

  return (
    <Flex className="p-4 m-4">
      <Card className="flex flex-col items-center justify-center gap-4">
        <Metric>Coefficient relatif à l&apos;ancienneté</Metric>
        <Title className='mt-4'>Mon ancienneté</Title>
        <Flex justifyContent="center">
          <DatePicker
            className="w-40 mr-4"
            placeholder="Date de création"
            enableYearNavigation={true}
            weekStartsOn={1}
            displayFormat="dd/MM/yyyy"
            value={myDate ? new Date(myDate) : undefined}
            onValueChange={(d) => setMyDate(convertDate(d))}
          />
          <Text>{getDays(myDate) || 0} DUs créés</Text>
        </Flex>
        <Title className='mt-4'>Mon rôle</Title>
        <Flex className="mx-auto items-center justify-center">
          <Text>Vendeur</Text>
          <Switch className="flex mx-2" checked={isSeller} onChange={() => setIsSeller(!isSeller)} />
          <Text>Acheteur</Text>
        </Flex>
        <Title className='mt-4'>Nom {!isSeller ? 'du vendeur' : "de l'acheteur"}</Title>
        <TextInput className="w-40" placeholder="Nom du vendeur" value={otherName} onValueChange={setOtherName} />
        <Title className='mt-4'>Ancienneté {otherName ? 'de ' + otherName : !isSeller ? 'du vendeur' : "de l'acheteur"}</Title>
        <DatePicker
          className="w-40"
          placeholder="Date de création"
          enableYearNavigation={true}
          weekStartsOn={1}
          displayFormat="dd/MM/yyyy"
          value={otherDate ? new Date(otherDate) : undefined}
          onValueChange={(d) => setOtherDate(convertDate(d))}
        />
        <Title className='mt-4 hidden'>Ratio : {otherDate && myDate ? (getDays(otherDate) / getDays(myDate)).toFixed(2) : 1}</Title>
        <Title className='mt-4'>Prix (en DU)</Title>
        <NumberInput className="w-40" style={{ width: 160 }} min={0} value={price} onValueChange={setPrice} />
        <Title className='mt-4'>Réduction (en %)</Title>
        <NumberInput
          className="w-40"
          style={{ width: 160 }}
          min={0}
          max={100}
          step={25}
          value={discount}
          onValueChange={setDiscount}
        />
        <Title className='mt-4'>Prix final : {getFinalPrice(isSeller ? myDate : otherDate).toFixed(2)}</Title>
      </Card>
      <Flex className="w-8 h-8" style={{ visibility: 'hidden' }}>
        <Title>xxx</Title>
      </Flex>
      <Card className="ml-8 flex flex-col items-center justify-center gap-4">
        <Metric>Mes amis</Metric>
        <Grid className="grid grid-cols-1 gap-4">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Nom</TableHeaderCell>
                <TableHeaderCell>Prix final</TableHeaderCell>
                <TableHeaderCell>Date création</TableHeaderCell>
                <TableHeaderCell>Nombre de DUs</TableHeaderCell>
                <TableHeaderCell></TableHeaderCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {friends.map((friend, index) => (
                <TableRow key={index}>
                  <TableCell>{friend.name} </TableCell>
                  <TableCell>{getFinalPrice(friend.date).toFixed(2)}</TableCell>
                  <TableCell>{new Date(friend.date).toLocaleDateString()}</TableCell>
                  <TableCell>{getDays(friend.date)} DUs créés</TableCell>
                  {index >= baseFriends.length && (
                    <Flex className="py-1">
                      <Icon
                        className="text-red-500 cursor-pointer"
                        size="lg"
                        icon={RiCloseCircleLine}
                        onClick={() => setFriends((friends) => friends.filter(({ name }) => name !== friend.name))}
                      />
                    </Flex>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
      </Card>
    </Flex>
  );
}
