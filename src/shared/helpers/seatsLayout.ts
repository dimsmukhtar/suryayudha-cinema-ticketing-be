import { SeatStatus } from '@prisma/client'

// prettier-ignore
const cinema1LayoutTemplate: (string | null)[][] = [
  ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10', 'A11', 'A12', 'A13', 'A14', 'A15'],
  ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', null, 'B8', 'B9', 'B10', 'B11', 'B12', 'B13', 'B14'],
  ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', null, 'C8', 'C9', 'C10', 'C11', 'C12', 'C13', 'C14'],
  ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', null, 'D8', 'D9', 'D10', 'D11', 'D12', 'D13', 'D14'],
  ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', null, 'E8', 'E9', 'E10', 'E11', 'E12', 'E13', 'E14'],
  ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', null, 'F8', 'F9', 'F10', 'F11', 'F12', 'F13', 'F14'],
  ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', null, 'G8', 'G9', 'G10', 'G11', 'G12', 'G13', 'G14'],
  ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', null, 'H8', 'H9', 'H10', 'H11', 'H12', 'H13', 'H14'],
  ['I1', 'I2', 'I3', 'I4', 'I5', 'I6', 'I7', null, 'I8', 'I9', 'I10', 'I11', 'I12', 'I13', 'I14'],
  ['J1', 'J2', 'J3', 'J4', 'J5', 'J6', 'J7', null, 'J8', 'J9', 'J10', 'J11', 'J12', 'J13', 'J14'],
  ['K1', 'K2', 'K3', 'K4', 'K5', 'K6', 'K7', null, 'K8', 'K9', 'K10', 'K11', 'K12', 'K13', 'K14'],
];

// prettier-ignore
const cinema2LayoutTemplate: (string | null)[][] = [
  ['K16', 'J16', 'I16', 'H16', 'G16', 'F16', 'E16', 'D16', 'C16', 'B12', 'A12'],
  ['K15', 'J15', 'I15', 'H15', 'G15', 'F15', 'E15', 'D15', 'C15', 'B11', 'A11'],
  ['K14', 'J14', 'I14', 'H14', 'G14', 'F14', 'E14', 'D14', 'C14', 'B10', 'A10'],
  ['K13', 'J13', 'I13', 'H13', 'G13', 'F13', 'E13', 'D13', 'C13', 'B9',  'A9'],
  ['K12', 'J12', 'I12', 'H12', 'G12', 'F12', 'E12', 'D12', 'C12', 'B8',  'A8'],
  ['K11', 'J11', 'I11', 'H11', 'G11', 'F11', 'E11', 'D11', 'C11', 'B7',  'A7'],
  ['K10', 'J10', 'I10', 'H10', 'G10', 'F10', 'E10', 'D10', 'C10', null,  null],
  ['K9',  'J9',  'I9',  'H9',  'G9',  'F9',  'E9',  'D9',  'C9',  null,  null],
  [null,  null,  null,  null,  null,  null,  null,  null,  null,  null,  null], 
  ['K8',  'J8',  'I8',  'H8',  'G8',  'F8',  'E8',  'D8',  'C8',  null,  null],
  ['K7',  'J7',  'I7',  'H7',  'G7',  'F7',  'E7',  'D7',  'C7',  null,  null],
  ['K6',  'J6',  'I6',  'H6',  'G6',  'F6',  'E6',  'D6',  'C6',  'B6',  'A6'],
  ['K5',  'J5',  'I5',  'H5',  'G5',  'F5',  'E5',  'D5',  'C5',  'B5',  'A5'],
  ['K4',  'J4',  'I4',  'H4',  'G4',  'F4',  'E4',  'D4',  'C4',  'B4',  'A4'],
  ['K3',  'J3',  'I3',  'H3',  'G3',  'F3',  'E3',  'D3',  'C3',  'B3',  'A3'],
  ['K2',  'J2',  'I2',  'H2',  'G2',  'F2',  'E2',  'D2',  'C2',  'B2',  'A2'],
  ['K1',  'J1',  'I1',  'H1',  'G1',  'F1',  'E1',  'D1',  'C1',  'B1',  'A1'],
];

// prettier-ignore
const cinema3LayoutTemplate: (string | null)[][] = [
  ['A1',  'B1', 'C1',  'D1', 'E1', 'F1', 'G1', 'H1', 'I1', 'J1', 'K1', 'L1'],
  ['A2',  'B2', 'C2',  'D2', 'E2', 'F2', 'G2', 'H2', 'I2', 'J2', 'K2', 'L2'],
  ['A3',  'B3', 'C3',  'D3', 'E3', 'F3', 'G3', 'H3', 'I3', 'J3', 'K3', 'L3'],
  ['A4',  'B4', 'C4',  'D4', 'E4', 'F4', 'G4', 'H4', 'I4', 'J4', 'K4', 'L4'],
  ['A5',  'B5', 'C5',  'D5', 'E5', 'F5', 'G5', 'H5', 'I5', 'J5', 'K5', 'L5'],
  ['A6',  'B6', 'C6',  'D6', 'E6', 'F6', 'G6', 'H6', 'I6', 'J6', 'K6', 'L6'],
  ['A7',  'B7', 'C7',  'D7', 'E7', 'F7', 'G7', 'H7', 'I7', 'J7', 'K7', 'L7'],
  ['A8',  null, null,  null, null, null, null, null, null, null, null, null],
  ['A9',  'B8', 'C8',  'D8', 'E8', 'F8', 'G8', 'H8', 'I8', 'J8', 'K8', 'L8'],
  ['A10', 'B9', 'C9',  'D9', 'E9', 'F9', 'G9', 'H9', 'I9', 'J9', 'K9', 'L9'],
  ['A11','B10','C10', 'D10','E10','F10','G10','H10','I10','J10','K10', 'L10'],
  ['A12','B11','C11', 'D11','E11','F11','G11','H11','I11','J11','K11', 'L11'],
  ['A13','B12','C12', 'D12','E12','F12','G12','H12','I12','J12','K12', 'L12'],
  ['A14','B13','C13', 'D13','E13','F13', null,'H13','I13','J13','K13', 'L13']
]

type CombinedSeatData = {
  seatId: number
  scheduleSeatId: number | null
  label: string
  status: SeatStatus
}

export const transformSeatsLayout = (
  combinedSeatData: CombinedSeatData[],
  studioId: string
): (CombinedSeatData | null)[][] => {
  let template: (string | null)[][]

  switch (studioId) {
    case 'cinema-1':
      template = cinema1LayoutTemplate
      break
    case 'cinema-2':
      template = cinema2LayoutTemplate
      break
    case 'cinema-3':
      template = cinema3LayoutTemplate
      break
    default:
      return []
  }

  const seatMap = new Map<string, CombinedSeatData>()
  combinedSeatData.forEach((seat) => seatMap.set(seat.label, seat))

  const finalLayout = template.map((row) =>
    row.map((seatLabel) => {
      if (seatLabel === null) {
        return null
      }

      return seatMap.get(seatLabel) || null
    })
  )
  return finalLayout
}
