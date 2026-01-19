'use client';

import TelomereCard from './TelomereCard';
import BiomarkerSection from './BiomarkerSection';

const hormoneBalanceBiomarkers = [
  {
    name: 'Calcium',
    description: 'Knochendichte',
    status: 'low' as const,
    value: '6 mg/dL',
  },
  {
    name: 'Magnesium',
    description: 'Stimmungs- & Schlafindikator',
    status: 'optimal' as const,
    value: '3 mg/dL',
  },
  {
    name: 'Vitamin B12',
    description: 'Energieproduktion',
    status: 'low' as const,
    value: '9 mg/dL',
  },
  {
    name: 'Folat',
    description: 'Zellproduktion & Reparatur',
    status: 'optimal' as const,
    value: '3 mg/dL',
  },
];

const cognitionBiomarkers = [
  {
    name: 'Cortisol',
    description: 'Stressindikator',
    status: 'no-data' as const,
    value: '-',
  },
  {
    name: 'Glukose',
    description: 'Blutzucker',
    status: 'no-data' as const,
    value: '-',
  },
  {
    name: 'Vitamin B12',
    description: 'Energieproduktion',
    status: 'low' as const,
    value: '9 mg/dL',
  },
  {
    name: 'Folat',
    description: 'Zellproduktion & Reparatur',
    status: 'optimal' as const,
    value: '3 mg/dL',
  },
];

const inflammationBiomarkers = [
  {
    name: 'hsCRP',
    description: 'Entzündungsindikator',
    status: 'low' as const,
    value: '6 mg/dL',
  },
  {
    name: 'Ferritin',
    description: 'Eisenspeicher',
    status: 'no-data' as const,
    value: '-',
  },
  {
    name: 'Vitamin D',
    description: 'Knochendichte & Energie',
    status: 'low' as const,
    value: '9 mg/dL',
  },
  {
    name: 'Weiße Blutkörperchen',
    description: 'Entzündungsindikator',
    status: 'optimal' as const,
    value: '3 mg/dL',
  },
];

export default function BiomarkerDashboard() {
  return (
    <div className="biomarker-dashboard">
      <TelomereCard />
      <BiomarkerSection
        title="Hormon-Balance"
        description="Hormone sind chemische Botenstoffe, die viele biologische Prozesse steuern. Das Gleichgewicht beeinflusst Schlaf, Energie und Wohlbefinden. Die folgenden Biomarker spiegeln die Effizienz deiner Hormon-Balance wider:"
        biomarkers={hormoneBalanceBiomarkers}
      />
      <BiomarkerSection
        title="Kognition"
        description="Kognition beschreibt die Leistungsfähigkeit deines Gehirns und Nervensystems. Sie beeinflusst Reaktionszeit, Stimmung, Informationsverarbeitung und Gedächtnis. Die folgenden Biomarker spiegeln die Effizienz deiner Kognition wider:"
        biomarkers={cognitionBiomarkers}
      />
      <BiomarkerSection
        title="Entzündungen"
        description="Entzündungen beschreiben die Fähigkeit deines Körpers, auf Fremdstoffe, Infektionen und Stress zu reagieren und sich zu schützen. Die folgenden Biomarker spiegeln die Effizienz deiner Entzündungsabwehr wider:"
        biomarkers={inflammationBiomarkers}
      />
    </div>
  );
}

