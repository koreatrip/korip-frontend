import { useInterestContext } from '@/context/InterestContext';

interface Interest {
  id: string;
  label: string;
}

interface SelectedInterestsProps {
  interests: Interest[];
}

const SelectedInterests = ({ interests }: SelectedInterestsProps) => {
  const { selectedInterests } = useInterestContext();

  const getLabelById = (id: string) => {
    const interest = interests.find((interest) => interest.id === id);
    return interest ? interest.label : id;
  };

  return (
    <div className='flex flex-wrap gap-2 py-4'>
      {selectedInterests.map((id) => (
        <div
          key={id}
          className='bg-main-pink rounded-full px-3 py-1 text-sm text-white'
        >
          #{getLabelById(id)}
        </div>
      ))}
    </div>
  );
};

export default SelectedInterests;
