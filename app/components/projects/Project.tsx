import Image from 'next/image';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface ProjectProps {
  title: string;
  year: string;
  description: string;
  image: string;
}

export const Project = ({ title, year, description, image }: ProjectProps) => {
  return (
    <Card className='overflow-hidden border-0 shadow-md h-full flex flex-col pt-0'>
      <div className='h-48 relative -mt-px -ml-px -mr-px'>
        <Image
          src={`/assets/${image}`}
          alt={title}
          fill
          className='object-cover rounded-t-xl'
        />
      </div>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
};
