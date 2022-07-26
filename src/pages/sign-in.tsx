import { FormHandles, SubmitHandler } from '@unform/core'
import { Form } from '@unform/web'
import type { GetServerSideProps, NextPage } from 'next'
import { signIn } from 'next-auth/react'
import Head from 'next/head'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { Input } from 'src/components/Input'
import { setAuthLevelToRoute } from 'src/utils/setAuthLevelToRoute'

type FormData = {
  login: string
  password: string
}

const SignIn: NextPage = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const formRef = useRef<FormHandles>(null)

  const handleSubmit: SubmitHandler<FormData> = async (data) => {
    const { login, password } = data
    setIsLoggingIn(true)
    formRef.current?.setErrors({})

    const res: any = await signIn('credentials', {
      login,
      password,
      redirect: false,
    })

    setIsLoggingIn(false)

    if (res.ok) {
      window.location.reload()
      return
    }

    formRef.current?.setErrors({
      password: 'Invalid login or password.',
    })
  }

  return (
    <>
      <Head>
        <title>OnePass - Sign in</title>
        <meta property='og:title' content='OnePass - Sign in' />
      </Head>

      <main>
        <section className='bg-primary text-primary-content flex flex-col items-center justify-center py-12 mb-12'>
          <strong className='text-4xl mt-2'>OnePass</strong>
          <h1 className='text-center mt-4 text-xl'>Sign in</h1>
        </section>
        <section className='px-4'>
          <Form
            className='max-w-5xl mx-auto flex flex-col gap-2'
            ref={formRef}
            onSubmit={handleSubmit}
          >
            <Input type='text' placeholder='john.doe@example.com' name='login' label='Login' />
            <Input type='password' placeholder='********' name='password' label='Password' />
            <button
              type='submit'
              className={`btn btn-primary w-full mt-8 ${isLoggingIn ? 'loading' : ''}`}
            >
              Sign In
            </button>
            <p className='text-center mt-4 text-primary-content'>
              Don&apos;t have an account?{' '}
              <Link href='/register'>
                <a className='link'>Register now</a>
              </Link>
            </p>
          </Form>
        </section>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return setAuthLevelToRoute('guest', ctx)
}

export default SignIn
