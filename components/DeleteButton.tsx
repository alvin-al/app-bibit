import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface DeleteButtonType {
  onClick: () => void;
  title: string;
}

const DeleteButton = ({ onClick, title }: DeleteButtonType) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const deleteCard = (
    <div className='flex items-center justify-center overflow-clip z-50 fixed inset-0 bg-black/50'>
      <>
        <Card className='w-96'>
          <CardHeader>
            <CardTitle>Konfirmasi Hapus</CardTitle>
            <CardDescription className='text-gray-800'>
              Apakah anda yakin ingin menghapus produk {title}?
            </CardDescription>
          </CardHeader>
          <CardContent className='flex justify-end space-x-4'>
            {" "}
            <Button variant='secondary' onClick={() => setIsOpen(!isOpen)}>
              Batal
            </Button>
            <Button
              variant='destructive'
              onClick={() => {
                onClick();
                setIsOpen(!isOpen);
              }}
            >
              Hapus
            </Button>
          </CardContent>
        </Card>
      </>
    </div>
  );

  return (
    <>
      {" "}
      <Button variant='destructive' onClick={() => setIsOpen(!isOpen)}>
        Hapus
      </Button>
      {isOpen && deleteCard}
    </>
  );
};

export default DeleteButton;
