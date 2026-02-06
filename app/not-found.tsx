import UnavailableCard from './components/UnavailableCard';

export default function NotFound() {
    return (
        <UnavailableCard
            title="Paste Unavailable"
            message="This paste has expired, reached its view limit, or does not exist."
            icon="x"
        />
    );
}
