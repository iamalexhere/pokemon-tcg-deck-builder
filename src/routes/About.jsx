import styles from './about.module.css';
import alexUserImage from '../assets/images/team/alex.jpg';
import zakkiUserImage from '../assets/images/team/zakki.jpg';
import elvinUserImage from '../assets/images/team/elvin.jpg';
import vinchentUserImage from '../assets/images/team/vinchent.jpg';
import uusUserImage from '../assets/images/team/uus.jpg';

// Data untuk anggota tim disimpan dalam sebuah array of objects.
const teamMembers = [
  {
    id: 1,
    name: 'Imanuel Alexander Here',
    role: 'Devops',
    description: 'Deploy Early, Verify Once, Pray Silently.',
    imageUrl: alexUserImage, 
    contactLink: 'https://github.com/iamalexhere'
  },
  {
    id: 2,
    name: 'Muhammad Zakki Baldani',
    role: 'Gooning Analyst',
    description: 'Not every day is a good day, but there is something good in every day.',
    imageUrl: zakkiUserImage,
    contactLink: 'https://github.com/zakkib'
  },
  {
    id: 3,
    name: 'Syalom Elvin Pasau',
    role: 'doom scroller',
    description: 'bukan sulap bukan she/her.',
    imageUrl: elvinUserImage,
    contactLink: 'https://github.com/SyalomElvinPasau'
  },
  {
    id: 4,
    name: 'Alexander Vinchent',
    role: 'engineer furry hunter',
    description: 'You are not alone to be furry.',
    imageUrl: vinchentUserImage,
    contactLink: 'https://github.com/Basin312'
  },
  {
    id: 5,
    name: 'Gregorius Denmas Bagus Pradipto',
    role: 'Profesional smoker',
    description: 'El humo lo es todo.',
    imageUrl: uusUserImage,
    contactLink: 'https://github.com/Gregorius-Denmas'
  }
];

// Komponen fungsional untuk menampilkan kartu anggota tim.
function TeamMemberCard({ member }) {
  return (
    <div class={styles.teamCard}>
      <div class={styles.cardImagePlaceholder}>
        {member.imageUrl ? (
          <img src={member.imageUrl} alt={member.name} class={styles.memberImage} />
        ) : (
          <span>Image</span>
        )}
      </div>
      <div class={styles.cardContent}>
        <h3 class={styles.memberName}>{member.name}</h3>
        <p class={styles.memberRole}>{member.role}</p>
        <p class={styles.memberDescription}>{member.description}</p>
        <a href={member.contactLink} class={styles.contactButton}>Contact</a>
      </div>
    </div>
  );
}

// Komponen utama halaman "About" yang me-render daftar anggota tim.
function About() {
  return (
    <div class={styles.aboutPageContainer}>
      <h1 class={styles.pageTitle}>Our Team</h1>
      {/* Melakukan iterasi pada array teamMembers untuk me-render setiap kartu anggota. */}
      <div class={styles.teamGrid}>
        {teamMembers.map(member => (
          <TeamMemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}

export default About;