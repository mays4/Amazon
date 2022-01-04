import React from 'react'
import Image from 'next/image'
import { useSelector } from 'react-redux'
import Header  from '../components/Header';
import CheckoutProduct  from '../components/CheckoutProduct';
import { selectItems } from '../slices/basketSlice'
 export const checkout = () => {
  const items = useSelector(selectItems);
  console.log("item",items)
  return (
    <div className='pg-gray-100 '>
      <Header />
      <main className="lg:flex max-w-screen-2xl mx-auto ">
        <div className=' flex-grow m-5  shadow-sm'>
          <Image src="https://links.papareact.com/ikj" 
          alt=""
          width={1020}
          height={254}
          objectFit='contain'
          />
         <div className='flex flex-col p-5 space-y-10 bg-white '>
           <h1 className='text-3xl border-b pb-4'>
             {items.length === 0 ? "your Basket is empty." : "shopping Basket"} </h1>
           {items.map((item,i) =>
           
             <CheckoutProduct
             key={i}
             id={item.id}
             title={item.title}
             rating={item.rating}
             price={item.price}
             description={item.description}
             category={item.category}
             image={item.image}
             hasPrime={item.hasPrime}

             />
             
           
           )}
         
         </div>
        </div>
        <div>

        </div>
      </main>
    </div>
  )
}

export default checkout






