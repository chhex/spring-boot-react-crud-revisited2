import {useEffect} from 'react'

export function Head({ title }: { title: string }): null {
  useEffect(() => {
    document.title = `${title} | Spring React Demo`;
  }, [title]);
  return null;
}
