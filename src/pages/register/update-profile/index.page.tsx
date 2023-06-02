import {
  Avatar,
  Button,
  Heading,
  MultiStep,
  Text,
  TextArea,
} from '@kawassaki-ui/react'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Container, Header } from '../styles'
import { FormAnnotation, ProfileBox } from './styles'
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../../../pages/api/auth/[...nextauth].api'
import { useSession } from 'next-auth/react'
import { api } from '../../../lib/axios'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'

const updateProfileSchema = z.object({
  bio: z.string(),
})

type UpdateProfileData = z.infer<typeof updateProfileSchema>

export default function UpdateProfile() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema),
  })

  const session = useSession()
  const router = useRouter()

  async function hanldeUpdatePorfile(data: UpdateProfileData) {
    await api.put('/users/update-profile', {
      bio: data.bio,
    })

    await router.push(`/schedule/${session.data?.user.username}`)
  }

  return (
    <>
      <NextSeo title="Atualize seu perfil | Kawassaki call" noindex />
      <Container>
        <Header>
          <Heading as="strong">Defina sua disponibilidade! </Heading>
          <Text>Por último, uma breve descrição e uma foto de perfil.</Text>

          <MultiStep size={4} currentStep={4} />
          <ProfileBox as="form" onSubmit={handleSubmit(hanldeUpdatePorfile)}>
            <label>
              <Text size="sm"> Foto de perfil </Text>
              <Avatar
                src={session.data?.user.avatar_url}
                alt={session.data?.user.name}
                referrerPolicy="no-referrer"
              />
            </label>

            <label>
              <Text size="sm"> Sobre Você </Text>
              <TextArea {...register('bio')} />
              <FormAnnotation size="sm">
                Fale um pouco sobre você. Isto será exibido em sua página
                pessoal.
              </FormAnnotation>
            </label>

            <Button type="submit" disabled={isSubmitting}>
              Finalizar
              <ArrowRight />
            </Button>
          </ProfileBox>
        </Header>
      </Container>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )
  return {
    props: {
      session,
    },
  }
}
