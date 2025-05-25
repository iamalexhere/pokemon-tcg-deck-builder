import styles from './about.module.css';
//import alexUserImage from '../assets/images/team/alex.jpg';

const teamMembers = [
  {
    id: 1,
    name: 'Imanuel Alexander Here',
    role: 'Devops',
    description: 'placeholder',
    imageUrl: '', 
    contactLink: 'https://github.com/iamalexhere'
  },
  {
    id: 2,
    name: 'Muhammad Zakki Baldani',
    role: 'placeholder',
    description: 'placeholder',
    imageUrl: '',
    contactLink: ''
  },
  {
    id: 3,
    name: 'Syalom Elvin Pasau',
    role: 'placeholder',
    description: 'placeholder',
    imageUrl: '',
    contactLink: ''
  },
  {
    id: 4,
    name: 'Alexander Vinchent',
    role: 'placeholder',
    description: 'placeholder',
    imageUrl: '',
    contactLink: ''
  },
  {
    id: 5,
    name: 'Gregorius Denmas Bagus Pradipto',
    role: 'placeholder',
    description: 'placeholder',
    imageUrl: '',
    contactLink: ''
  }
];

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

function About() {
  return (
    <div class={styles.aboutPageContainer}>
      <h1 class={styles.pageTitle}>Our Team</h1>
      <div class={styles.teamGrid}>
        {teamMembers.map(member => (
          <TeamMemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}

export default About;