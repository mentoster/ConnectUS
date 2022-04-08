import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import BottomContent from '../components/home/bottom_content'
import HomeTitle from '../components/home/HomeTitle'
import RadioImage from '../components/home/RadioImage'
import Menu from '../components/navbar/menu'
import Title from '../components/navbar/Title'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (

    <div className='relative pl-36 pr-36'>
      <div className='flow-root pt-5'>
        <div className='float-left '>
          <Title />
        </div>
        <div className='float-right'>
          <Menu />
        </div>
      </div>
      <div style={{ height: 900 }}>
        <div className='pt-56 absolute  z-10'>
          <HomeTitle />
        </div>
        <div className='absolute inset-y-0 right-0 z-0'>
          <RadioImage />
        </div>
      </div>

      <BottomContent />

    </div >

  )
}

export default Home
