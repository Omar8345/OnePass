import { FormHandles, SubmitHandler } from '@unform/core'
import { Form } from '@unform/web'
import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useRef } from 'react'
import { Input } from 'src/components/Input'
import { notify } from 'src/utils/notify'
import { setAuthLevelToRoute } from 'src/utils/setAuthLevelToRoute'
import { trpc } from 'src/utils/trpc'

type FormData = {
  name: string
  login: string
  password: string
  passwordConfirmation: string
}

const Register: NextPage = () => {
  const formRef = useRef<FormHandles>(null)
  const router = useRouter()

  const { mutate, isLoading } = trpc.useMutation('users.create', {
    onSuccess: () => {
      notify('success', 'Account created successfully.')
      router.push('/sign-in')
    },
  })

  const handleSubmit: SubmitHandler<FormData> = (data) => {
    const { login, name, password, passwordConfirmation } = data
    formRef.current?.setErrors({})

    if (password !== passwordConfirmation) {
      formRef.current?.setErrors({
        passwordConfirmation: 'Passwords do not match.',
      })

      return
    }

    mutate({
      name,
      login,
      password,
    })
  }

  return (
    <>
      <Head>
        <title>OnePass - Register</title>
        <meta property='og:title' content='OnePass - Register' />
      </Head>

      <main>
        <section className='bg-secondary text-secondary-content flex flex-col items-center justify-center py-12 mb-12'>
          <strong className='text-4xl mt-2'>OnePass</strong>
          <h1 className='text-center mt-4 text-xl'>Register</h1>
        </section>
        <section className='px-4'>
          <Form
            className='max-w-5xl mx-auto flex flex-col gap-2'
            ref={formRef}
            onSubmit={handleSubmit}
          >
            <Input type='text' placeholder='john.doe@example.com' name='login' label='Login' />
            <Input type='text' placeholder='John Doe' name='name' label='Name' />
            <Input type='password' placeholder='********' name='password' label='Password' />
            <Input
              type='password'
              placeholder='********'
              name='passwordConfirmation'
              label='Password Confirmation'
            />
            <button
              type='submit'
              className={`btn btn-secondary w-full mt-8 ${isLoading ? 'loading' : ''}`}
            >
              Create account
            </button>
            <p className='text-center mt-4 text-secondary-content'>
              Already have an account?{' '}
              <Link href='/sign-in'>
                <a className='link'>Sign in now</a>
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

export default Register
