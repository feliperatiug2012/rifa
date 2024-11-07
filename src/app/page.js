'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function Rifa() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedNumber, setSelectedNumber] = useState(null)
  const [participantName, setParticipantName] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('pagado')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [numbers, setNumbers] = useState([])
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [sellerName, setSellerName] = useState('');
  
  const personNames = [
      { name: 'Alice', numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      { name: 'Bob', numbers: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
      { name: 'Charlie', numbers: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
      { name: 'David', numbers: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40] },
      { name: 'Eve', numbers: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50] },
      { name: 'Frank', numbers: [51, 52, 53, 54, 55, 56, 57, 58, 59, 60] },
      { name: 'Grace', numbers: [61, 62, 63, 64, 65, 66, 67, 68, 69, 70] },
      { name: 'Hannah', numbers: [71, 72, 73, 74, 75, 76, 77, 78, 79, 80] },
      { name: 'Isaac', numbers: [81, 82, 83, 84, 85, 86, 87, 88, 89, 90] },
      { name: 'Julia', numbers: [91, 92, 93, 94, 95, 96, 97, 98, 99, 100] },
  ];
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/numbers');
        const data = await response.json();
        setNumbers(data)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleNumberClick = (number) => {
    setSelectedNumber(number);
    const numberToCompare = parseInt(number.toString().replace(/^0+/, '') || '100');
    //set Seller name
    let person = "";
    personNames.forEach(personName => {
      if(personName.numbers.includes(numberToCompare)) {
        person = personName.name
      }
    });
    setSellerName(person);
    setIsOpen(true);
  }

  const handleSubmit = async (e) => {
      e.preventDefault();
      let data = {};
      setButtonDisabled(true);
      try {
        const response = await fetch('http://localhost:3001/api/numbers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userName: participantName,
            number: selectedNumber,
            state: paymentStatus,
            seller: phoneNumber
          })
        });
        data = await response.json();
        console.log('Data sent successfully:', data);
      } catch (error) {
        console.error('Error sending data to API:', error);
      }
    setButtonDisabled(false)
    setIsOpen(false);
    setNumbers([...numbers, data]);
    setParticipantName('');
    setPaymentStatus('pagado');
    setPhoneNumber('');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-6 md:mb-8">
        <Image
          src="/Logo_Atletico.png"
          alt="Logo del sorteo"
          width={80}
          height={80}
          className="mx-auto mb-3 md:mb-4 md:w-[100px] md:h-[100px]"
        />
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Gran Rifa - Atletico Independiente - Categoría 2013-2014</h1>
        <p className="text-lg md:text-xl text-muted-foreground">¡Gana una genial ancheta y un expectacular balón de futbol!, selecciona tu número favorito y participa por solo $10.000</p>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2 md:gap-4">
        {
          numbers.length >= 1 ?
            Array.from({ length: 100 }, (_, i) => i + 1).map((number) => {
              number = number < 10 ? `0${number}` : number === 100 ? '00' : number.toString();
              const numberFound = numbers.find(n => n.number === number);
              return (<Button
                key={number}
                variant="outline"
                className="aspect-square text-sm md:text-lg font-bold p-1 md:p-2"
                onClick={() => handleNumberClick(number)}
                disabled={numberFound ? true : false}
                style={{ backgroundColor: numberFound?.state === 'pagado' ? 'blue' : numberFound?.state === 'debe' ? 'red' : '' }}
              >
                {number}
              </Button>);
          })
          :
            <p>Cargando</p>
        }
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Información del Participante</DialogTitle>
            <DialogDescription>
              Número seleccionado: {selectedNumber}
            </DialogDescription>
            <DialogDescription>
              Valor Rifa: $10.000
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nombre
              </Label>
              <Input
                id="name"
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Telefono
              </Label>
              <Input
                id="seller"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Estado</Label>
              <RadioGroup
                value={paymentStatus}
                onValueChange={setPaymentStatus}
                className="col-span-3"
                required
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pagado" id="pagado" />
                  <Label htmlFor="pagado">Pagado</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="debe" id="debe" />
                  <Label htmlFor="debe">Debe</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="seller" className="text-right">
                Vendedor
              </Label>
              <p>{sellerName}</p>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={buttonDisabled}>Guardar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}