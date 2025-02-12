import React from 'react'
import { CButton, CCol, CForm, CFormInput, CRow } from '@coreui/react'

function CommonForm(props) {
  const {
    label,
    value,
    onChange,
    placeholder,
    type,
    onSubmit,
    validated,
    isEdit,
    id,
    btnText,
    inputs,
    xs,
  } = props
  return (
    <CForm
      className="row g-3 needs-validation"
      noValidate
      validated={validated}
      onSubmit={onSubmit}
    >
      {inputs}
    </CForm>
  )
}

export default CommonForm
