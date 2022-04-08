import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import HomeTitle from '../components/home/HomeTitle'
import RadioImage from '../components/home/RadioImage'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (

    <div className='relative pl-36 pr-36'>
      <div className='pt-56 absolute flex justify-start z-10'>
        <HomeTitle />
      </div>
      <div className='absolute inset-y-0 right-0 z-0'>
        <RadioImage />
      </div>
    </div >

  )
}

export default Home
