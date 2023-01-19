import Link from 'next/link';

import axios from 'axios';
import moment from 'moment'
import { useEffect, useState } from 'react';

export default function Home() {
  const [error, setError] = useState<any>(null);
  const [notes, setNotes] = useState<any>([]);
  
  useEffect(() => {
    axios
      // .get(process.env.NEXT_PUBLIC_API_BASE_URL + '/api/notes')
      .post(process.env.NEXT_PUBLIC_API_BASE_URL + '/graphql',{
        query: `
        query{
          notes(sort: "publishedAt:desc"){
            data{
              id,
              attributes{
                url, site_title, site_image, site_description, note, publishedAt
              }
            }
            meta {
              pagination {
                page
                pageSize
                total
                pageCount
              }
            }
          }
        }
    `,
      } )
      .then(response => {
        // console.log(response.data.data.notes.data);
        setNotes(response.data.data.notes.data);
      })
      .catch((error) => setError(error))
  }, [])
  
  if (error) {
    // Print errors if any
    return <div>An error occured: {error.message}</div>;
  }

  return (
    <div>
      {notes.map((note:any) => {
        return (
        <div key={note.id} className="p-2">
          <p className=''>{moment(note.attributes.publishedAt).format('YYYY年M月D日 H:m')}</p>
          <div className=''>{note.attributes.note}</div>
          
            <div className='flex border border-inherit'>
              <div className='p-3 shrink-0'>
                <Link href={note.attributes.url} target='_blank' rel="noopener noreferrer">
                  <img src={note.attributes.site_image} className='object-cover w-[8rem] h-[8rem]'></img>
                  </Link>
              </div>
              <div className='pt-3'>
                <p className='font-bold text-lg'>
                  <Link href={note.attributes.url} target='_blank' rel="noopener noreferrer">
                    {note.attributes.site_title}
                  </Link>
                </p>
                <p className='text-gray-400'>
                  {note.attributes.site_description}
                </p>
              </div>
            </div>
          
        </div>
    )}
    )}
    </div>
  );
}
