import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import HomeTitle from '../components/home/HomeTitle'
import RadioImage from '../components/home/RadioImage'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (

    <div>
      <div className="flex flex-row items-center justify-center">
        <HomeTitle />
        <RadioImage />
      </div>

    </div>
  )
}

export default Home
