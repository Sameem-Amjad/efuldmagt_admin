/* eslint-disable react/prop-types */
import { ChevronsUpDown, MapPinIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { useJsApiLoader } from "@react-google-maps/api";
import LoadingSpinner from "./Loaders/LoadingSpinner";

const mapKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const LocationField = ({
  form,
  label = "Location",
  placeholder = "Search location",
}) => {
  const libraries = useMemo(() => ["places", "geometry"], []);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: mapKey || "",
    libraries,
    async: true,
  });

  if (loadError) {
    return <div>Error loading Google Maps API</div>;
  }

  if (!isLoaded) {
    return <LoadingSpinner className={"w-5 h-5 text-textColor/40"} />;
  }

  if (isLoaded) {
    return <AutoComplete form={form} label={label} placeholder={placeholder} />;
  }
};

const AutoComplete = ({ form, label, placeholder }) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const [buttonWidth, setButtonWidth] = useState(350);
  const [userLocation, setUserLocation] = useState(null);
  const [distances, setDistances] = useState({});

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    debounce: 300,
  });

  const calculateDistance = useCallback(
    async (placeLatLng) => {
      if (!userLocation) return null;

      const userLatLng = new window.google.maps.LatLng(
        userLocation.lat,
        userLocation.lng
      );
      const placeLatLngObject = new window.google.maps.LatLng(
        placeLatLng.lat,
        placeLatLng.lng
      );

      const distanceInMeters =
        window.google.maps.geometry.spherical.computeDistanceBetween(
          userLatLng,
          placeLatLngObject
        );

      return (distanceInMeters / 1000).toFixed(2);
    },
    [userLocation]
  );

  const getLocationCodes = useCallback(
    async (address) => {
      try {
        const results = await getGeocode({ address });
        const { lat, lng } = getLatLng(results[0]);

        const distance = await calculateDistance({ lat, lng });
        setDistances((prevDistances) => ({
          ...prevDistances,
          [address]: distance,
        }));
      } catch (error) {
        throw new Error("Error fetching location codes: ", error);
      }
    },
    [calculateDistance]
  );

  useEffect(() => {
    const getData = async () => {
      if (data.length > 0) {
        data.forEach((suggestion) => {
          getLocationCodes(suggestion.description);
        });
      }
    };
    getData();
  }, [data, getLocationCodes]);

  useEffect(() => {
    const askForLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            alert(
              "Location access is required to provide better results. Please enable location services in your browser settings."
            );
          } else {
            console.error("Error getting user location: ", error);
          }
        }
      );
    };

    askForLocation();

    const updateButtonWidth = () => {
      if (buttonRef.current) {
        setButtonWidth(buttonRef.current.offsetWidth);
      }
    };

    updateButtonWidth();
    window.addEventListener("resize", updateButtonWidth);

    return () => {
      window.removeEventListener("resize", updateButtonWidth);
    };
  }, []);

  const handleSelectLocation = async (suggestion) => {
    const { description } = suggestion;
    const results = await getGeocode({ address: description });
    const { lat, lng } = getLatLng(results[0]);
    setValue(description, false);
    clearSuggestions();
    setOpen(false);

    form.setValue("location", {
      name: description,
      latitude: lat,
      longitude: lng,
    });
  };

  return (
    <FormField
      control={form.control}
      name="location"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover className="w-full" open={open} onOpenChange={setOpen}>
            <PopoverTrigger className="w-full" asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full flex flex-row items-center justify-between truncate",
                    !field.value && "text-muted-foreground"
                  )}
                  style={{ maxWidth: `${buttonWidth}px` }}
                  ref={buttonRef}
                >
                  {field.value ? (
                    <p className="truncate">{field.value.name}</p>
                  ) : (
                    <p className="truncate text-input">{placeholder}</p>
                  )}

                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent
              style={{ width: `${buttonWidth}px` }}
              className="p-0"
            >
              <Command>
                <CommandInput
                  value={value}
                  onValueChange={(value) => {
                    setValue(value);
                  }}
                  disabled={!ready}
                />
                <CommandList>
                  {status === "OK" && data.length > 0 ? (
                    <CommandGroup>
                      {data.map((suggestion) => (
                        <CommandItem
                          key={suggestion.place_id}
                          value={suggestion.description}
                          onSelect={() => handleSelectLocation(suggestion)}
                        >
                          <div className="flex flex-row gap-4 justify-between w-full">
                            <div className="flex flex-row gap-2 text-textColor">
                              <MapPinIcon className="h-4 w-4 shrink-0" />
                              <p>{suggestion.description}</p>
                            </div>
                            <p>
                              {distances[suggestion.description] && (
                                <span className="text-xs text-gray-400 text-nowrap">
                                  {`${
                                    distances[suggestion.description]
                                  } km away`}
                                </span>
                              )}
                            </p>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ) : (
                    <CommandEmpty>No locations found.</CommandEmpty>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default LocationField;
