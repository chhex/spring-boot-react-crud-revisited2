
// src/__tests__/clients.flow.test.tsx
import { render, screen, within } from '@/test-utils'
import { describe, it, expect } from 'vitest'
import { App } from '@/App'

const widths = [360, 768, 1280]

describe('Clients flow (Edit from list)', () => {
  it.each(widths)(
    'lists clients and opens Edit via button at %opx',
    async (width) => {
      window.happyDOM?.setViewport({ width, height: 720 })

      const { user } = render(<App />, { route: '/' })

      // table headers as smoke test
      expect(await screen.findByRole('columnheader', { name: /name/i })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: /email/i })).toBeInTheDocument()


      // find the table row that contains the client name
      const row = await screen.findByRole('row', { name: /Third Client/i })
     
      // click the Edit button in that row
      // best: by role 'link' + accessible name
      const editLink = within(row).getByRole('link', { name: /^edit$/i })
      await user.click(editLink)

      // now on the details/edit page: assert form fields are present and prefilled
      expect(await screen.findByRole('heading', { name: /edit client|client details/i }))
        .toBeInTheDocument()
      expect(screen.getByLabelText(/name/i)).toHaveValue('Third Client')
      expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument()
    }
  )
})