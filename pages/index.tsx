import Link from 'next/link';
import Header from '../components/header'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'

import axios from 'axios';
import moment from 'moment'


export default function Home() {
  const router = useRouter();

  const [error, setError] = useState<any>('');
  const [notes, setNotes] = useState<any>([]);

  let fetchKeyword:string|null = null;
  function fetchNotes(keyword:string)
  {
    if( keyword === fetchKeyword ){
      return;
    }
    fetchKeyword = keyword;
    axios
      .post(process.env.NEXT_PUBLIC_API_BASE_URL + '/graphql',{
        query: `
        query($searchQuery: String!){
          notes(
            sort: "publishedAt:desc",
            filters: {
              or: [
                {note: {contains: $searchQuery} },
                {site_title: {contains: $searchQuery} },
                {site_description: {contains: $searchQuery} },
            ]}
        ){
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
    variables: {searchQuery: keyword}
      } )
      .then(response => {
        setNotes(response.data.data.notes.data);
      })
      .catch((error) => setError(error));
  }

  useEffect(() => {
    console.log('useEffect router.isReady='+router.isReady);
    if(!router.isReady){
      return;
    }

    let keyword = '';
    if( router.query.keyword ){
      if( Array.isArray(router.query.keyword)){
        keyword = router.query.keyword[0] as string;
      }else{
        keyword = router.query.keyword as string;
      }
    }
    fetchNotes(keyword);
  }, [router.query])
  
  if (error) {
    // Print errors if any
    return <div>An error occured: {error.message}</div>;
  }

  return (
    <div>
      <Header/>

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
