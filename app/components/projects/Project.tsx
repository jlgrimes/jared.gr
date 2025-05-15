import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface ProjectProps {
  title: string;
  description: string;
  content: string;
  image: string;
}

export const Project = ({
  title,
  description,
  content,
  image,
}: ProjectProps) => {
  return (
    <Card className='overflow-hidden shadow-md h-full flex flex-col pt-0'>
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
      <CardContent>{content}</CardContent>
    </Card>
  );
};
