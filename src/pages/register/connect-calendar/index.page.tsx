import { Button, Heading, MultiStep, Text } from '@kawassaki-ui/react'
import { Container, Header } from '../styles'
import { ArrowRight, Check } from 'phosphor-react'
import { AuthError, ConnectBox, ConnectItem } from './styles'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

export default function ConnectCalendar() {
  const session = useSession()
  const router = useRouter()

  const hasAuthError = useMemo(() => !!router.query.error, [router.query.error])
  const isSignedIn = useMemo(
    () => session.status === 'authenticated',
    [session.status],
  )

  async function handleConnectCalendar() {
    await signIn('google')
  }

  async function handleNavigateToNextStep() {
    await router.push(`/register/time-intervals`)
  }

  return (
    <Container>
      <Header>
        <Heading as="strong">Conecte sua agenda! </Heading>
        <Text>
          Conecte o seu calendário para verificar automaticamente as horas
          ocupadas e os novos eventos à medida em que são agendados.
        </Text>

        <MultiStep size={4} currentStep={2} />
      </Header>
      <ConnectBox>
        <ConnectItem>
          <Text>Google Calendar</Text>
          {isSignedIn ? (
            <Button disabled>
              Conectado
              <Check size="sm" />
            </Button>
          ) : (
            <Button variant="secondary" onClick={handleConnectCalendar}>
              Conectar
              <ArrowRight />
            </Button>
          )}
        </ConnectItem>
        {hasAuthError ? (
          <AuthError size="sm">
            Falha ao se conectar ao google, verifique se você habilitou as
            permissões de acesso ao Google Calendar.
          </AuthError>
        ) : null}

        <Button
          type="submit"
          disabled={hasAuthError && !isSignedIn}
          onClick={handleNavigateToNextStep}
        >
          Próximo passo
          <ArrowRight />
        </Button>
      </ConnectBox>
    </Container>
  )
}
